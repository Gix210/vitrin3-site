// Copié tel quel en release/site/_worker.js par package-release.cjs.
//
// Cloudflare Pages ignore l'en-tête Range sur ses fichiers statiques : un .mp4 part
// toujours entier, en 200. Safari sur iPhone et iPad exige une réponse 206 pour lire
// une vidéo, et refuse donc de la jouer. Netlify répondait 206 ; ce worker rétablit
// ce comportement. _routes.json le limite aux seuls .mp4, tout le reste du site
// reste servi en statique sans passer par ici.
export default {
  async fetch(request, env) {
    // Une réponse HEAD n'a pas de corps : impossible d'en connaître la taille.
    // On demande donc toujours le fichier en GET, et on retire le corps à la fin.
    const head = request.method === 'HEAD';
    const response = await env.ASSETS.fetch(head ? new Request(request, { method: 'GET' }) : request);
    // 404, redirection, ou un jour un 206 natif : on ne touche à rien.
    if (response.status !== 200) return response;

    const headers = new Headers(response.headers);
    headers.set('Accept-Ranges', 'bytes');

    const match = /^bytes=(\d*)-(\d*)$/.exec((request.headers.get('Range') || '').trim());
    // Pas de plage, ou une forme non gérée comme les plages multiples : fichier entier.
    if (!match || (match[1] === '' && match[2] === '')) {
      return new Response(head ? null : response.body, { status: 200, headers });
    }

    const body = await response.arrayBuffer();
    const size = body.byteLength;
    let start, end;
    if (match[1] === '') {
      // bytes=-500 : les 500 derniers octets.
      start = Math.max(0, size - Number(match[2]));
      end = size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    }

    if (start >= size || start > end) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${size}`, 'Accept-Ranges': 'bytes' },
      });
    }

    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    // Le corps a été décodé par arrayBuffer() : un éventuel encodage ne vaut plus.
    headers.delete('Content-Encoding');
    return new Response(head ? null : body.slice(start, end + 1), { status: 206, headers });
  },
};
