// zzfx micro sound engine
// https://github.com/KilledByAPixel/ZzFX

export const zzfx = (p = []) => {
    let
        e = 44100,
        t = 0,
        r = 0,
        n = 0,
        a = 0,
        i = 0,
        o = 1,
        s = 0,
        f = 0,
        u = 0,
        c = 0,
        x = 0,
        h = 0,
        d = 0,
        m = 0,
        l = 0,
        b = 0,
        z = 0,
        y = 0,
        g = 0,
        w = 0,
        k = 0,
        v = 0,
        q = 0,
        A = 0,
        B = 0,
        C = 0,
        D = 0,
        E = 0,
        F = 0,
        G = 0,
        H = 0,
        I = 0,
        J = 0,
        K = 0,
        L = 0,
        M = 0,
        N = 0,
        O = 0,
        P = 0,
        Q = 0,
        R = 0,
        S = 0,
        T = 0,
        U = 0,
        V = 0,
        W = 0,
        X = 0,
        Y = 0,
        Z = 0;

    let
        j = Math.sin,
        $ = Math.pow,
        _ = Math.random,
        aa = Math.abs,
        ab = Math.PI;

    let ac = new (window.AudioContext || window.webkitAudioContext)();
    let ad = ac.createBufferSource();
    let ae = ac.createBuffer(1, e, e);
    let af = ae.getChannelData(0);

    for (; r < e; r++) {
        af[r] = j(t * ab * 2) * o;
        t += p[0] || 0.01;
        o *= p[1] || 0.999;
    }

    ad.buffer = ae;
    ad.connect(ac.destination);
    ad.start();
};
