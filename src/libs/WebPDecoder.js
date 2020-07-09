function WebPDecoder(imageData) {
  // Copyright 2011 Google Inc.
  //
  // This code is licensed under the same terms as WebM:
  //  Software License Agreement:  http://www.webmproject.org/license/software/
  //  Additional IP Rights Grant:  http://www.webmproject.org/license/additional/
  // -----------------------------------------------------------------------------
  //
  // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  // ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  // WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  // IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
  // INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
  // BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
  // OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  // NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
  // EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  //
  // -----------------------------------------------------------------------------
  //
  // Copyright 2011-2017 Dominik Homberger
  // Libwebp Javascript / libwebpjs - the libwebp implementation in javascript (v0.6.0)
  //
  // Author: Dominik Homberger (dominik.homberger@gmail.com)

  var self = this;
  var UpsampleRgbLinePair,
    UpsampleBgrLinePair,
    UpsampleRgbaLinePair,
    UpsampleBgraLinePair,
    UpsampleArgbLinePair,
    UpsampleArgbLinePair,
    UpsampleRgba4444LinePair,
    UpsampleRgb565LinePair;

  function x(F) {
    if (!F) throw Error("assert :P");
  }
  function fa(F, L, J) {
    for (var H = 0; 4 > H; H++) if (F[L + H] != J.charCodeAt(H)) return !0;
    return !1;
  }
  function I(F, L, J, H, Z) {
    for (var O = 0; O < Z; O++) F[L + O] = J[H + O];
  }
  function M(F, L, J, H) {
    for (var Z = 0; Z < H; Z++) F[L + Z] = J;
  }
  function V(F) {
    return new Int32Array(F);
  }
  function wa(F, L) {
    for (var J = [], H = 0; H < F; H++) J.push(new L());
    return J;
  }
  function wb() {
    function F(J, H, Z) {
      for (var O = Z[H], L = 0; L < O; L++) {
        J.push(Z.length > H + 1 ? [] : 0);
        if (Z.length < H + 1) break;
        F(J[L], H + 1, Z);
      }
    }
    var L = [];
    F(L, 0, [3, 11]);
    return L;
  }
  function Ed(F, L) {
    function J(H, O, F) {
      for (var Z = F[O], ma = 0; ma < Z; ma++) {
        H.push(F.length > O + 1 ? [] : new L());
        if (F.length < O + 1) break;
        J(H[ma], O + 1, F);
      }
    }
    var H = [];
    J(H, 0, F);
    return H;
  }
  WebPDecoder = function() {
    var self = this;
    function F() {
      V(55);
    }
    function L(a, b) {
      for (var c = (1 << (b - 1)) >>> 0; a & c; ) c >>>= 1;
      return c ? (a & (c - 1)) + c : a;
    }
    function J(a, b, c, d, e) {
      x(!(d % c));
      do (d -= c), (a[b + d] = e);
      while (0 < d);
    }
    function H(a, b, c, d, e, f) {
      var g = b,
        h = 1 << c,
        k,
        l,
        m = V(16),
        n = V(16);
      x(0 != e);
      x(null != d);
      x(null != a);
      x(0 < c);
      for (l = 0; l < e; ++l) {
        if (15 < d[l]) return 0;
        ++m[d[l]];
      }
      if (m[0] == e) return 0;
      n[1] = 0;
      for (k = 1; 15 > k; ++k) {
        if (m[k] > 1 << k) return 0;
        n[k + 1] = n[k] + m[k];
      }
      for (l = 0; l < e; ++l) (k = d[l]), 0 < d[l] && (f[n[k]++] = l);
      if (1 == n[15])
        return (d = new O()), (d.g = 0), (d.value = f[0]), J(a, g, 1, h, d), h;
      var r = -1,
        q = h - 1,
        t = 0,
        v = 1,
        p = 1,
        u,
        w = 1 << c;
      l = 0;
      k = 1;
      for (e = 2; k <= c; ++k, e <<= 1) {
        p <<= 1;
        v += p;
        p -= m[k];
        if (0 > p) return 0;
        for (; 0 < m[k]; --m[k])
          (d = new O()),
            (d.g = k),
            (d.value = f[l++]),
            J(a, g + t, e, w, d),
            (t = L(t, k));
      }
      k = c + 1;
      for (e = 2; 15 >= k; ++k, e <<= 1) {
        p <<= 1;
        v += p;
        p -= m[k];
        if (0 > p) return 0;
        for (; 0 < m[k]; --m[k]) {
          d = new O();
          if ((t & q) != r) {
            g += w;
            r = k;
            for (u = 1 << (r - c); 15 > r; ) {
              u -= m[r];
              if (0 >= u) break;
              ++r;
              u <<= 1;
            }
            u = r - c;
            w = 1 << u;
            h += w;
            r = t & q;
            a[b + r].g = u + c;
            a[b + r].value = g - b - r;
          }
          d.g = k - c;
          d.value = f[l++];
          J(a, g + (t >> c), e, w, d);
          t = L(t, k);
        }
      }
      return v != 2 * n[15] - 1 ? 0 : h;
    }
    function Z(a, b, c, d, e) {
      x(2328 >= e);
      if (512 >= e) var f = V(512);
      else if (((f = V(e)), null == f)) return 0;
      return H(a, b, c, d, e, f);
    }
    function O() {
      this.value = this.g = 0;
    }
    function Fd() {
      this.value = this.g = 0;
    }
    function Ub() {
      this.G = wa(5, O);
      this.H = V(5);
      this.jc = this.Qb = this.qb = this.nd = 0;
      this.pd = wa(xb, Fd);
    }
    function ma(a, b, c, d) {
      x(null != a);
      x(null != b);
      x(2147483648 > d);
      a.Ca = 254;
      a.I = 0;
      a.b = -8;
      a.Ka = 0;
      a.oa = b;
      a.pa = c;
      a.Jd = b;
      a.Yc = c + d;
      a.Zc = 4 <= d ? c + d - 4 + 1 : c;
      Qa(a);
    }
    function na(a, b) {
      for (var c = 0; 0 < b--; ) c |= K(a, 128) << b;
      return c;
    }
    function ca(a, b) {
      var c = na(a, b);
      return G(a) ? -c : c;
    }
    function cb(a, b, c, d) {
      var e,
        f = 0;
      x(null != a);
      x(null != b);
      x(4294967288 > d);
      a.Sb = d;
      a.Ra = 0;
      a.u = 0;
      a.h = 0;
      4 < d && (d = 4);
      for (e = 0; e < d; ++e) f += b[c + e] << (8 * e);
      a.Ra = f;
      a.bb = d;
      a.oa = b;
      a.pa = c;
    }
    function Vb(a) {
      for (; 8 <= a.u && a.bb < a.Sb; )
        (a.Ra >>>= 8),
          (a.Ra += (a.oa[a.pa + a.bb] << (ob - 8)) >>> 0),
          ++a.bb,
          (a.u -= 8);
      db(a) && ((a.h = 1), (a.u = 0));
    }
    function D(a, b) {
      x(0 <= b);
      if (!a.h && b <= Gd) {
        var c = pb(a) & Hd[b];
        a.u += b;
        Vb(a);
        return c;
      }
      a.h = 1;
      return (a.u = 0);
    }
    function Wb() {
      this.b = this.Ca = this.I = 0;
      this.oa = [];
      this.pa = 0;
      this.Jd = [];
      this.Yc = 0;
      this.Zc = [];
      this.Ka = 0;
    }
    function Ra() {
      this.Ra = 0;
      this.oa = [];
      this.h = this.u = this.bb = this.Sb = this.pa = 0;
    }
    function pb(a) {
      return (a.Ra >>> (a.u & (ob - 1))) >>> 0;
    }
    function db(a) {
      x(a.bb <= a.Sb);
      return a.h || (a.bb == a.Sb && a.u > ob);
    }
    function qb(a, b) {
      a.u = b;
      a.h = db(a);
    }
    function Sa(a) {
      a.u >= Xb && (x(a.u >= Xb), Vb(a));
    }
    function Qa(a) {
      x(null != a && null != a.oa);
      a.pa < a.Zc
        ? ((a.I = (a.oa[a.pa++] | (a.I << 8)) >>> 0), (a.b += 8))
        : (x(null != a && null != a.oa),
          a.pa < a.Yc
            ? ((a.b += 8), (a.I = a.oa[a.pa++] | (a.I << 8)))
            : a.Ka
            ? (a.b = 0)
            : ((a.I <<= 8), (a.b += 8), (a.Ka = 1)));
    }
    function G(a) {
      return na(a, 1);
    }
    function K(a, b) {
      var c = a.Ca;
      0 > a.b && Qa(a);
      var d = a.b,
        e = (c * b) >>> 8,
        f = (a.I >>> d > e) + 0;
      f ? ((c -= e), (a.I -= ((e + 1) << d) >>> 0)) : (c = e + 1);
      d = c;
      for (e = 0; 256 <= d; ) (e += 8), (d >>= 8);
      d = 7 ^ (e + Id[d]);
      a.b -= d;
      a.Ca = (c << d) - 1;
      return f;
    }
    function ra(a, b, c) {
      a[b + 0] = (c >> 24) & 255;
      a[b + 1] = (c >> 16) & 255;
      a[b + 2] = (c >> 8) & 255;
      a[b + 3] = (c >> 0) & 255;
    }
    function Ta(a, b) {
      return (a[b + 0] << 0) | (a[b + 1] << 8);
    }
    function Yb(a, b) {
      return Ta(a, b) | (a[b + 2] << 16);
    }
    function Ha(a, b) {
      return Ta(a, b) | (Ta(a, b + 2) << 16);
    }
    function Zb(a, b) {
      var c = 1 << b;
      x(null != a);
      x(0 < b);
      a.X = V(c);
      if (null == a.X) return 0;
      a.Mb = 32 - b;
      a.Xa = b;
      return 1;
    }
    function $b(a, b) {
      x(null != a);
      x(null != b);
      x(a.Xa == b.Xa);
      I(b.X, 0, a.X, 0, 1 << b.Xa);
    }
    function ac() {
      this.X = [];
      this.Xa = this.Mb = 0;
    }
    function bc(a, b, c, d) {
      x(null != c);
      x(null != d);
      var e = c[0],
        f = d[0];
      0 == e && (e = (a * f + b / 2) / b);
      0 == f && (f = (b * e + a / 2) / a);
      if (0 >= e || 0 >= f) return 0;
      c[0] = e;
      d[0] = f;
      return 1;
    }
    function xa(a, b) {
      return (a + (1 << b) - 1) >>> b;
    }
    function yb(a, b) {
      return (
        (((((a & 4278255360) + (b & 4278255360)) >>> 0) & 4278255360) +
          ((((a & 16711935) + (b & 16711935)) >>> 0) & 16711935)) >>>
        0
      );
    }
    function X(a, b) {
      self[b] = function(b, d, e, f, g, h, k) {
        var c;
        for (c = 0; c < g; ++c) {
          var m = self[a](h[k + c - 1], e, f + c);
          h[k + c] = yb(b[d + c], m);
        }
      };
    }
    function Jd() {
      this.ud = this.hd = this.jd = 0;
    }
    function aa(a, b) {
      return ((((a ^ b) & 4278124286) >>> 1) + (a & b)) >>> 0;
    }
    function sa(a) {
      if (0 <= a && 256 > a) return a;
      if (0 > a) return 0;
      if (255 < a) return 255;
    }
    function eb(a, b) {
      return sa(a + ((a - b + 0.5) >> 1));
    }
    function Ia(a, b, c) {
      return Math.abs(b - c) - Math.abs(a - c);
    }
    function cc(a, b, c, d, e, f, g) {
      d = f[g - 1];
      for (c = 0; c < e; ++c) f[g + c] = d = yb(a[b + c], d);
    }
    function Kd(a, b, c, d, e) {
      var f;
      for (f = 0; f < c; ++f) {
        var g = a[b + f],
          h = (g >> 8) & 255,
          k = g & 16711935,
          k = k + ((h << 16) + h),
          k = k & 16711935;
        d[e + f] = ((g & 4278255360) + k) >>> 0;
      }
    }
    function dc(a, b) {
      b.jd = (a >> 0) & 255;
      b.hd = (a >> 8) & 255;
      b.ud = (a >> 16) & 255;
    }
    function Ld(a, b, c, d, e, f) {
      var g;
      for (g = 0; g < d; ++g) {
        var h = b[c + g],
          k = h >>> 8,
          l = h >>> 16,
          m = h,
          l = l + ((((a.jd << 24) >> 24) * ((k << 24) >> 24)) >>> 5),
          l = l & 255,
          m = m + ((((a.hd << 24) >> 24) * ((k << 24) >> 24)) >>> 5),
          m = m + ((((a.ud << 24) >> 24) * ((l << 24) >> 24)) >>> 5),
          m = m & 255;
        e[f + g] = (h & 4278255360) + (l << 16) + m;
      }
    }
    function ec(a, b, c, d, e) {
      self[b] = function(a, b, c, k, l, m, n, r, q) {
        for (k = n; k < r; ++k)
          for (n = 0; n < q; ++n) l[m++] = e(c[d(a[b++])]);
      };
      self[a] = function(a, b, h, k, l, m, n) {
        var f = 8 >> a.b,
          g = a.Ea,
          t = a.K[0],
          v = a.w;
        if (8 > f)
          for (a = (1 << a.b) - 1, v = (1 << f) - 1; b < h; ++b) {
            var p = 0,
              u;
            for (u = 0; u < g; ++u)
              u & a || (p = d(k[l++])), (m[n++] = e(t[p & v])), (p >>= f);
          }
        else self["VP8LMapColor" + c](k, l, t, v, m, n, b, h, g);
      };
    }
    function Md(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++];
        d[e++] = (f >> 16) & 255;
        d[e++] = (f >> 8) & 255;
        d[e++] = (f >> 0) & 255;
      }
    }
    function Nd(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++];
        d[e++] = (f >> 16) & 255;
        d[e++] = (f >> 8) & 255;
        d[e++] = (f >> 0) & 255;
        d[e++] = (f >> 24) & 255;
      }
    }
    function Od(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++],
          g = ((f >> 16) & 240) | ((f >> 12) & 15),
          f = ((f >> 0) & 240) | ((f >> 28) & 15);
        d[e++] = g;
        d[e++] = f;
      }
    }
    function Pd(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++],
          g = ((f >> 16) & 248) | ((f >> 13) & 7),
          f = ((f >> 5) & 224) | ((f >> 3) & 31);
        d[e++] = g;
        d[e++] = f;
      }
    }
    function Qd(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++];
        d[e++] = (f >> 0) & 255;
        d[e++] = (f >> 8) & 255;
        d[e++] = (f >> 16) & 255;
      }
    }
    function fb(a, b, c, d, e, f) {
      if (0 == f)
        for (c = b + c; b < c; )
          (f = a[b++]),
            ra(
              d,
              ((f[0] >> 24) |
                ((f[1] >> 8) & 65280) |
                ((f[2] << 8) & 16711680) |
                (f[3] << 24)) >>>
                0
            ),
            (e += 32);
      else I(d, e, a, b, c);
    }
    function gb(a, b) {
      self[b][0] = self[a + "0"];
      self[b][1] = self[a + "1"];
      self[b][2] = self[a + "2"];
      self[b][3] = self[a + "3"];
      self[b][4] = self[a + "4"];
      self[b][5] = self[a + "5"];
      self[b][6] = self[a + "6"];
      self[b][7] = self[a + "7"];
      self[b][8] = self[a + "8"];
      self[b][9] = self[a + "9"];
      self[b][10] = self[a + "10"];
      self[b][11] = self[a + "11"];
      self[b][12] = self[a + "12"];
      self[b][13] = self[a + "13"];
      self[b][14] = self[a + "0"];
      self[b][15] = self[a + "0"];
    }
    function hb(a) {
      return a == zb || a == Ab || a == Ja || a == Bb;
    }
    function Rd() {
      this.eb = [];
      this.size = this.A = this.fb = 0;
    }
    function Sd() {
      this.y = [];
      this.f = [];
      this.ea = [];
      this.F = [];
      this.Tc = this.Ed = this.Cd = this.Fd = this.lb = this.Db = this.Ab = this.fa = this.J = this.W = this.N = this.O = 0;
    }
    function Cb() {
      this.Rd = this.height = this.width = this.S = 0;
      this.f = {};
      this.f.RGBA = new Rd();
      this.f.kb = new Sd();
      this.sd = null;
    }
    function Td() {
      this.width = [0];
      this.height = [0];
      this.Pd = [0];
      this.Qd = [0];
      this.format = [0];
    }
    function Ud() {
      this.Id = this.fd = this.Md = this.hb = this.ib = this.da = this.bd = this.cd = this.j = this.v = this.Da = this.Sd = this.ob = 0;
    }
    function Vd(a) {
      alert("todo:WebPSamplerProcessPlane");
      return a.T;
    }
    function Wd(a, b) {
      var c = a.T,
        d = b.ba.f.RGBA,
        e = d.eb,
        f = d.fb + a.ka * d.A,
        g = P[b.ba.S],
        h = a.y,
        k = a.O,
        l = a.f,
        m = a.N,
        n = a.ea,
        r = a.W,
        q = b.cc,
        t = b.dc,
        v = b.Mc,
        p = b.Nc,
        u = a.ka,
        w = a.ka + a.T,
        y = a.U,
        A = (y + 1) >> 1;
      0 == u
        ? g(h, k, null, null, l, m, n, r, l, m, n, r, e, f, null, null, y)
        : (g(b.ec, b.fc, h, k, q, t, v, p, l, m, n, r, e, f - d.A, e, f, y),
          ++c);
      for (; u + 2 < w; u += 2)
        (q = l),
          (t = m),
          (v = n),
          (p = r),
          (m += a.Rc),
          (r += a.Rc),
          (f += 2 * d.A),
          (k += 2 * a.fa),
          g(h, k - a.fa, h, k, q, t, v, p, l, m, n, r, e, f - d.A, e, f, y);
      k += a.fa;
      a.j + w < a.o
        ? (I(b.ec, b.fc, h, k, y),
          I(b.cc, b.dc, l, m, A),
          I(b.Mc, b.Nc, n, r, A),
          c--)
        : w & 1 ||
          g(
            h,
            k,
            null,
            null,
            l,
            m,
            n,
            r,
            l,
            m,
            n,
            r,
            e,
            f + d.A,
            null,
            null,
            y
          );
      return c;
    }
    function Xd(a, b, c) {
      var d = a.F,
        e = [a.J];
      if (null != d) {
        var f = a.U,
          g = b.ba.S,
          h = g == ya || g == Ja;
        b = b.ba.f.RGBA;
        var k = [0],
          l = a.ka;
        k[0] = a.T;
        a.Kb &&
          (0 == l ? --k[0] : (--l, (e[0] -= a.width)),
          a.j + a.ka + a.T == a.o && (k[0] = a.o - a.j - l));
        var m = b.eb,
          l = b.fb + l * b.A;
        a = fc(d, e[0], a.width, f, k, m, l + (h ? 0 : 3), b.A);
        x(c == k);
        a && hb(g) && za(m, l, h, f, k, b.A);
      }
      return 0;
    }
    function gc(a) {
      var b = a.ma,
        c = b.ba.S,
        d = 11 > c,
        e = c == Ua || c == Va || c == ya || c == Db || 12 == c || hb(c);
      b.memory = null;
      b.Ib = null;
      b.Jb = null;
      b.Nd = null;
      if (!hc(b.Oa, a, e ? 11 : 12)) return 0;
      e && hb(c) && ic();
      if (a.da) alert("todo:use_scaling");
      else {
        if (d) {
          if (((b.Ib = Vd), a.Kb)) {
            c = (a.U + 1) >> 1;
            b.memory = V(a.U + 2 * c);
            if (null == b.memory) return 0;
            b.ec = b.memory;
            b.fc = 0;
            b.cc = b.ec;
            b.dc = b.fc + a.U;
            b.Mc = b.cc;
            b.Nc = b.dc + c;
            b.Ib = Wd;
            ic();
          }
        } else alert("todo:EmitYUV");
        e && ((b.Jb = Xd), d && Aa());
      }
      if (d && !jc) {
        for (a = 0; 256 > a; ++a)
          (Yd[a] = (89858 * (a - 128) + Ba) >> Wa),
            (Zd[a] = -22014 * (a - 128) + Ba),
            ($d[a] = -45773 * (a - 128)),
            (ae[a] = (113618 * (a - 128) + Ba) >> Wa);
        for (a = ta; a < Eb; ++a)
          (b = (76283 * (a - 16) + Ba) >> Wa),
            (be[a - ta] = ga(b, 255)),
            (ce[a - ta] = ga((b + 8) >> 4, 15));
        jc = 1;
      }
      return 1;
    }
    function kc(a) {
      var b = a.ma,
        c = a.U,
        d = a.T;
      x(!(a.ka & 1));
      if (0 >= c || 0 >= d) return 0;
      c = b.Ib(a, b);
      null != b.Jb && b.Jb(a, b, c);
      b.Dc += c;
      return 1;
    }
    function lc(a) {
      a.ma.memory = null;
    }
    function mc(a, b, c, d) {
      if (47 != D(a, 8)) return 0;
      b[0] = D(a, 14) + 1;
      c[0] = D(a, 14) + 1;
      d[0] = D(a, 1);
      return 0 != D(a, 3) ? 0 : !a.h;
    }
    function ib(a, b) {
      if (4 > a) return a + 1;
      var c = (a - 2) >> 1;
      return ((2 + (a & 1)) << c) + D(b, c) + 1;
    }
    function nc(a, b) {
      if (120 < b) return b - 120;
      var c = de[b - 1],
        c = (c >> 4) * a + (8 - (c & 15));
      return 1 <= c ? c : 1;
    }
    function ua(a, b, c) {
      var d = pb(c);
      b += d & 255;
      var e = a[b].g - 8;
      0 < e &&
        (qb(c, c.u + 8),
        (d = pb(c)),
        (b += a[b].value),
        (b += d & ((1 << e) - 1)));
      qb(c, c.u + a[b].g);
      return a[b].value;
    }
    function ub(a, b, c) {
      c.g += a.g;
      c.value += (a.value << b) >>> 0;
      x(8 >= c.g);
      return a.g;
    }
    function ha(a, b, c) {
      var d = a.xc;
      b = 0 == d ? 0 : a.vc[a.md * (c >> d) + (b >> d)];
      x(b < a.Wb);
      return a.Ya[b];
    }
    function oc(a, b, c, d) {
      var e = a.ab,
        f = a.c * b,
        g = a.C;
      b = g + b;
      var h = c,
        k = d;
      d = a.Ta;
      for (c = a.Ua; 0 < e--; ) {
        var l = a.gc[e],
          m = g,
          n = b,
          r = h,
          q = k,
          k = d,
          h = c,
          t = l.Ea;
        x(m < n);
        x(n <= l.nc);
        switch (l.hc) {
          case 2:
            pc(r, q, (n - m) * t, k, h);
            break;
          case 0:
            var v = l,
              p = m,
              u = n,
              w = k,
              y = h,
              A = v.Ea;
            0 == p &&
              (ee(r, q, null, null, 1, w, y),
              cc(r, q + 1, 0, 0, A - 1, w, y + 1),
              (q += A),
              (y += A),
              ++p);
            for (
              var E = 1 << v.b,
                B = E - 1,
                C = xa(A, v.b),
                N = v.K,
                v = v.w + (p >> v.b) * C;
              p < u;

            ) {
              var z = N,
                Q = v,
                S = 1;
              for (fe(r, q, w, y - A, 1, w, y); S < A; ) {
                var K = qc[(z[Q++] >> 8) & 15],
                  D = (S & ~B) + E;
                D > A && (D = A);
                K(r, q + +S, w, y + S - A, D - S, w, y + S);
                S = D;
              }
              q += A;
              y += A;
              ++p;
              p & B || (v += C);
            }
            n != l.nc && I(k, h - t, k, h + (n - m - 1) * t, t);
            break;
          case 1:
            t = r;
            u = q;
            r = l.Ea;
            q = 1 << l.b;
            w = q - 1;
            y = r & ~w;
            A = r - y;
            p = xa(r, l.b);
            E = l.K;
            for (l = l.w + (m >> l.b) * p; m < n; ) {
              B = E;
              C = l;
              N = new Jd();
              v = u + y;
              for (z = u + r; u < v; )
                dc(B[C++], N), Fb(N, t, u, q, k, h), (u += q), (h += q);
              u < z &&
                (dc(B[C++], N), Fb(N, t, u, A, k, h), (u += A), (h += A));
              ++m;
              m & w || (l += p);
            }
            break;
          case 3:
            if (r == k && q == h && 0 < l.b) {
              y = (n - m) * xa(l.Ea, l.b);
              t = h + (n - m) * t - y;
              u = k;
              r = t;
              q = k;
              w = h;
              A = y;
              p = [];
              for (y = A - 1; 0 <= y; --y) p[y] = q[w + y];
              for (y = A - 1; 0 <= y; --y) u[r + y] = p[y];
              rc(l, m, n, k, t, k, h);
            } else rc(l, m, n, r, q, k, h);
        }
        h = d;
        k = c;
      }
      k != c && I(d, c, h, k, f);
    }
    function ge(a, b) {
      var c = a.V,
        d = a.Ba + a.c * a.C,
        e = b - a.C;
      x(b <= a.l.o);
      x(16 >= e);
      if (0 < e) {
        var f = a.l,
          g = a.Ta,
          h = a.Ua,
          k = f.width;
        oc(a, e, c, d);
        h = [h];
        c = a.C;
        d = b;
        e = h;
        x(c < d);
        x(f.v < f.va);
        d > f.o && (d = f.o);
        if (c < f.j) {
          var l = f.j - c,
            c = f.j;
          e[0] += l * k;
        }
        c >= d
          ? (c = 0)
          : ((e[0] += 4 * f.v),
            (f.ka = c - f.j),
            (f.U = f.va - f.v),
            (f.T = d - c),
            (c = 1));
        if (c) {
          h = h[0];
          c = a.ca;
          if (11 > c.S) {
            for (
              var m = c.f.RGBA,
                d = c.S,
                e = f.U,
                f = f.T,
                l = m.eb,
                n = m.A,
                r = f,
                m = m.fb + a.Ma * m.A;
              0 < r--;

            ) {
              var q = g,
                t = h,
                v = e,
                p = l,
                u = m;
              switch (d) {
                case Ca:
                  sc(q, t, v, p, u);
                  break;
                case Ua:
                  Gb(q, t, v, p, u);
                  break;
                case zb:
                  Gb(q, t, v, p, u);
                  za(p, u, 0, v, 1, 0);
                  break;
                case tc:
                  uc(q, t, v, p, u);
                  break;
                case Va:
                  fb(q, t, v, p, u, 1);
                  break;
                case Ab:
                  fb(q, t, v, p, u, 1);
                  za(p, u, 0, v, 1, 0);
                  break;
                case ya:
                  fb(q, t, v, p, u, 0);
                  break;
                case Ja:
                  fb(q, t, v, p, u, 0);
                  za(p, u, 1, v, 1, 0);
                  break;
                case Db:
                  Hb(q, t, v, p, u);
                  break;
                case Bb:
                  Hb(q, t, v, p, u);
                  vc(p, u, v, 1, 0);
                  break;
                case wc:
                  xc(q, t, v, p, u);
                  break;
                default:
                  x(0);
              }
              h += k;
              m += n;
            }
            a.Ma += f;
          } else alert("todo:EmitRescaledRowsYUVA");
          x(a.Ma <= c.height);
        }
      }
      a.C = b;
      x(a.C <= a.i);
    }
    function yc(a) {
      var b;
      if (0 < a.ua) return 0;
      for (b = 0; b < a.Wb; ++b) {
        var c = a.Ya[b].G,
          d = a.Ya[b].H;
        if (
          0 < c[1][d[1] + 0].g ||
          0 < c[2][d[2] + 0].g ||
          0 < c[3][d[3] + 0].g
        )
          return 0;
      }
      return 1;
    }
    function zc(a, b, c, d, e, f) {
      if (0 != a.Z) {
        var g = a.qd,
          h = a.rd;
        for (x(null != ia[a.Z]); b < c; ++b)
          ia[a.Z](g, h, d, e, d, e, f), (g = d), (h = e), (e += f);
        a.qd = g;
        a.rd = h;
      }
    }
    function Ib(a, b) {
      var c = a.l.ma,
        d = 0 == c.Z || 1 == c.Z ? a.l.j : a.C,
        d = a.C < d ? d : a.C;
      x(b <= a.l.o);
      if (b > d) {
        var e = a.l.width,
          f = c.ca,
          g = c.tb + e * d,
          h = a.V,
          k = a.Ba + a.c * d,
          l = a.gc;
        x(1 == a.ab);
        x(3 == l[0].hc);
        he(l[0], d, b, h, k, f, g);
        zc(c, d, b, f, g, e);
      }
      a.C = a.Ma = b;
    }
    function Jb(a, b, c, d, e, f, g) {
      var h = a.$ / d,
        k = a.$ % d,
        l = a.m,
        m = a.s,
        n = c + a.$,
        r = n;
      e = c + d * e;
      var q = c + d * f,
        t = 280 + m.ua,
        v = a.Pb ? h : 16777216,
        p = 0 < m.ua ? m.Wa : null,
        u = m.wc,
        w = n < q ? ha(m, k, h) : null;
      x(a.C < f);
      x(q <= e);
      var y = !1;
      a: for (;;) {
        for (; y || n < q; ) {
          var A = 0;
          if (h >= v) {
            var v = a,
              E = n - c;
            x(v.Pb);
            v.wd = v.m;
            v.xd = E;
            0 < v.s.ua && $b(v.s.Wa, v.s.vb);
            v = h + ie;
          }
          k & u || (w = ha(m, k, h));
          x(null != w);
          w.Qb && ((b[n] = w.qb), (y = !0));
          if (!y)
            if ((Sa(l), w.jc)) {
              var A = l,
                E = b,
                B = n,
                C = w.pd[pb(A) & (xb - 1)];
              x(w.jc);
              256 > C.g
                ? (qb(A, A.u + C.g), (E[B] = C.value), (A = 0))
                : (qb(A, A.u + C.g - 256), x(256 <= C.value), (A = C.value));
              0 == A && (y = !0);
            } else A = ua(w.G[0], w.H[0], l);
          if (l.h) break;
          if (y || 256 > A) {
            if (!y)
              if (w.nd) b[n] = (w.qb | (A << 8)) >>> 0;
              else {
                Sa(l);
                y = ua(w.G[1], w.H[1], l);
                Sa(l);
                E = ua(w.G[2], w.H[2], l);
                B = ua(w.G[3], w.H[3], l);
                if (l.h) break;
                b[n] = ((B << 24) | (y << 16) | (A << 8) | E) >>> 0;
              }
            y = !1;
            ++n;
            ++k;
            if (
              k >= d &&
              ((k = 0),
              ++h,
              null != g && h <= f && !(h % 16) && g(a, h),
              null != p)
            )
              for (; r < n; )
                (A = b[r++]),
                  (p.X[((506832829 * A) & 4294967295) >>> p.Mb] = A);
          } else if (280 > A) {
            A = ib(A - 256, l);
            E = ua(w.G[4], w.H[4], l);
            Sa(l);
            E = ib(E, l);
            E = nc(d, E);
            if (l.h) break;
            if (n - c < E || e - n < A) break a;
            else for (B = 0; B < A; ++B) b[n + B] = b[n + B - E];
            n += A;
            for (k += A; k >= d; )
              (k -= d), ++h, null != g && h <= f && !(h % 16) && g(a, h);
            x(n <= e);
            k & u && (w = ha(m, k, h));
            if (null != p)
              for (; r < n; )
                (A = b[r++]),
                  (p.X[((506832829 * A) & 4294967295) >>> p.Mb] = A);
          } else if (A < t) {
            y = A - 280;
            for (x(null != p); r < n; )
              (A = b[r++]), (p.X[((506832829 * A) & 4294967295) >>> p.Mb] = A);
            A = n;
            E = p;
            x(!(y >>> E.Xa));
            b[A] = E.X[y];
            y = !0;
          } else break a;
          y || x(l.h == db(l));
        }
        if (a.Pb && l.h && n < e)
          x(a.m.h),
            (a.a = 5),
            (a.m = a.wd),
            (a.$ = a.xd),
            0 < a.s.ua && $b(a.s.vb, a.s.Wa);
        else if (l.h) break a;
        else null != g && g(a, h > f ? f : h), (a.a = 0), (a.$ = n - c);
        return 1;
      }
      a.a = 3;
      return 0;
    }
    function Ac(a) {
      x(null != a);
      a.vc = null;
      a.yc = null;
      a.Ya = null;
      var b = a.Wa;
      null != b && (b.X = null);
      a.vb = null;
      x(null != a);
    }
    function Bc() {
      var a = new je();
      if (null == a) return null;
      a.a = 0;
      a.xb = Cc;
      gb("Predictor", "VP8LPredictors");
      gb("Predictor", "VP8LPredictors_C");
      gb("PredictorAdd", "VP8LPredictorsAdd");
      gb("PredictorAdd", "VP8LPredictorsAdd_C");
      pc = Kd;
      Fb = Ld;
      sc = Md;
      Gb = Nd;
      Hb = Od;
      xc = Pd;
      uc = Qd;
      self.VP8LMapColor32b = ke;
      self.VP8LMapColor8b = le;
      return a;
    }
    function rb(a, b, c, d, e) {
      var f = 1,
        g = [a],
        h = [b],
        k = d.m,
        l = d.s,
        m = null,
        n = 0;
      a: for (;;) {
        if (c)
          for (; f && D(k, 1); ) {
            var r = g,
              q = h,
              t = d,
              v = 1,
              p = t.m,
              u = t.gc[t.ab],
              w = D(p, 2);
            if (t.Oc & (1 << w)) f = 0;
            else {
              t.Oc |= 1 << w;
              u.hc = w;
              u.Ea = r[0];
              u.nc = q[0];
              u.K = [null];
              ++t.ab;
              x(4 >= t.ab);
              switch (w) {
                case 0:
                case 1:
                  u.b = D(p, 3) + 2;
                  v = rb(xa(u.Ea, u.b), xa(u.nc, u.b), 0, t, u.K);
                  u.K = u.K[0];
                  break;
                case 3:
                  var y = D(p, 8) + 1,
                    A = 16 < y ? 0 : 4 < y ? 1 : 2 < y ? 2 : 3;
                  r[0] = xa(u.Ea, A);
                  u.b = A;
                  var v = rb(y, 1, 0, t, u.K),
                    E;
                  if ((E = v)) {
                    var B,
                      C = y,
                      N = u,
                      z = 1 << (8 >> N.b),
                      Q = V(z);
                    if (null == Q) E = 0;
                    else {
                      var S = N.K[0],
                        K = N.w;
                      Q[0] = N.K[0][0];
                      for (B = 1; B < 1 * C; ++B) Q[B] = yb(S[K + B], Q[B - 1]);
                      for (; B < 4 * z; ++B) Q[B] = 0;
                      N.K[0] = null;
                      N.K[0] = Q;
                      E = 1;
                    }
                  }
                  v = E;
                  break;
                case 2:
                  break;
                default:
                  x(0);
              }
              f = v;
            }
          }
        g = g[0];
        h = h[0];
        if (f && D(k, 1) && ((n = D(k, 4)), (f = 1 <= n && 11 >= n), !f)) {
          d.a = 3;
          break a;
        }
        var H;
        if ((H = f))
          b: {
            var F = d,
              G = g,
              L = h,
              J = n,
              T = c,
              Da,
              ba,
              X = F.m,
              R = F.s,
              P = [null],
              U,
              W = 1,
              aa = 0,
              na = me[J];
            c: for (;;) {
              if (T && D(X, 1)) {
                var ca = D(X, 3) + 2,
                  ga = xa(G, ca),
                  ka = xa(L, ca),
                  qa = ga * ka;
                if (!rb(ga, ka, 0, F, P)) break c;
                P = P[0];
                R.xc = ca;
                for (Da = 0; Da < qa; ++Da) {
                  var ia = (P[Da] >> 8) & 65535;
                  P[Da] = ia;
                  ia >= W && (W = ia + 1);
                }
              }
              if (X.h) break c;
              for (ba = 0; 5 > ba; ++ba) {
                var Y = Dc[ba];
                !ba && 0 < J && (Y += 1 << J);
                aa < Y && (aa = Y);
              }
              var ma = wa(W * na, O);
              var ua = W,
                va = wa(ua, Ub);
              if (null == va) var la = null;
              else x(65536 >= ua), (la = va);
              var ha = V(aa);
              if (null == la || null == ha || null == ma) {
                F.a = 1;
                break c;
              }
              var pa = ma;
              for (Da = U = 0; Da < W; ++Da) {
                var ja = la[Da],
                  da = ja.G,
                  ea = ja.H,
                  Fa = 0,
                  ra = 1,
                  Ha = 0;
                for (ba = 0; 5 > ba; ++ba) {
                  Y = Dc[ba];
                  da[ba] = pa;
                  ea[ba] = U;
                  !ba && 0 < J && (Y += 1 << J);
                  d: {
                    var sa,
                      za = Y,
                      ta = F,
                      oa = ha,
                      db = pa,
                      eb = U,
                      Ia = 0,
                      Ka = ta.m,
                      fb = D(Ka, 1);
                    M(oa, 0, 0, za);
                    if (fb) {
                      var gb = D(Ka, 1) + 1,
                        hb = D(Ka, 1),
                        Ja = D(Ka, 0 == hb ? 1 : 8);
                      oa[Ja] = 1;
                      2 == gb && ((Ja = D(Ka, 8)), (oa[Ja] = 1));
                      var ya = 1;
                    } else {
                      var Ua = V(19),
                        Va = D(Ka, 4) + 4;
                      if (19 < Va) {
                        ta.a = 3;
                        var Aa = 0;
                        break d;
                      }
                      for (sa = 0; sa < Va; ++sa) Ua[ne[sa]] = D(Ka, 3);
                      var Ba = void 0,
                        sb = void 0,
                        Wa = ta,
                        ib = Ua,
                        Ca = za,
                        Xa = oa,
                        Oa = 0,
                        La = Wa.m,
                        Ya = 8,
                        Za = wa(128, O);
                      e: for (;;) {
                        if (!Z(Za, 0, 7, ib, 19)) break e;
                        if (D(La, 1)) {
                          var kb = 2 + 2 * D(La, 3),
                            Ba = 2 + D(La, kb);
                          if (Ba > Ca) break e;
                        } else Ba = Ca;
                        for (sb = 0; sb < Ca && Ba--; ) {
                          Sa(La);
                          var $a = Za[0 + (pb(La) & 127)];
                          qb(La, La.u + $a.g);
                          var jb = $a.value;
                          if (16 > jb) (Xa[sb++] = jb), 0 != jb && (Ya = jb);
                          else {
                            var lb = 16 == jb,
                              ab = jb - 16,
                              mb = oe[ab],
                              bb = D(La, pe[ab]) + mb;
                            if (sb + bb > Ca) break e;
                            else
                              for (var nb = lb ? Ya : 0; 0 < bb--; )
                                Xa[sb++] = nb;
                          }
                        }
                        Oa = 1;
                        break e;
                      }
                      Oa || (Wa.a = 3);
                      ya = Oa;
                    }
                    (ya = ya && !Ka.h) && (Ia = Z(db, eb, 8, oa, za));
                    ya && 0 != Ia ? (Aa = Ia) : ((ta.a = 3), (Aa = 0));
                  }
                  if (0 == Aa) break c;
                  ra && 1 == qe[ba] && (ra = 0 == pa[U].g);
                  Fa += pa[U].g;
                  U += Aa;
                  if (3 >= ba) {
                    var Pa = ha[0],
                      tb;
                    for (tb = 1; tb < Y; ++tb) ha[tb] > Pa && (Pa = ha[tb]);
                    Ha += Pa;
                  }
                }
                ja.nd = ra;
                ja.Qb = 0;
                ra &&
                  ((ja.qb =
                    ((da[3][ea[3] + 0].value << 24) |
                      (da[1][ea[1] + 0].value << 16) |
                      da[2][ea[2] + 0].value) >>>
                    0),
                  0 == Fa &&
                    256 > da[0][ea[0] + 0].value &&
                    ((ja.Qb = 1), (ja.qb += da[0][ea[0] + 0].value << 8)));
                ja.jc = !ja.Qb && 6 > Ha;
                if (ja.jc) {
                  var Ga,
                    Ea = ja;
                  for (Ga = 0; Ga < xb; ++Ga) {
                    var Ma = Ga,
                      Na = Ea.pd[Ma],
                      vb = Ea.G[0][Ea.H[0] + Ma];
                    256 <= vb.value
                      ? ((Na.g = vb.g + 256), (Na.value = vb.value))
                      : ((Na.g = 0),
                        (Na.value = 0),
                        (Ma >>= ub(vb, 8, Na)),
                        (Ma >>= ub(Ea.G[1][Ea.H[1] + Ma], 16, Na)),
                        (Ma >>= ub(Ea.G[2][Ea.H[2] + Ma], 0, Na)),
                        ub(Ea.G[3][Ea.H[3] + Ma], 24, Na));
                  }
                }
              }
              R.vc = P;
              R.Wb = W;
              R.Ya = la;
              R.yc = ma;
              H = 1;
              break b;
            }
            H = 0;
          }
        f = H;
        if (!f) {
          d.a = 3;
          break a;
        }
        if (0 < n) {
          if (((l.ua = 1 << n), !Zb(l.Wa, n))) {
            d.a = 1;
            f = 0;
            break a;
          }
        } else l.ua = 0;
        var Qa = d,
          cb = g,
          ob = h,
          Ra = Qa.s,
          Ta = Ra.xc;
        Qa.c = cb;
        Qa.i = ob;
        Ra.md = xa(cb, Ta);
        Ra.wc = 0 == Ta ? -1 : (1 << Ta) - 1;
        if (c) {
          d.xb = re;
          break a;
        }
        m = V(g * h);
        if (null == m) {
          d.a = 1;
          f = 0;
          break a;
        }
        f = (f = Jb(d, m, 0, g, h, h, null)) && !k.h;
        break a;
      }
      f
        ? (null != e ? (e[0] = m) : (x(null == m), x(c)), (d.$ = 0), c || Ac(l))
        : Ac(l);
      return f;
    }
    function Ec(a, b) {
      var c = a.c * a.i,
        d = c + b + 16 * b;
      x(a.c <= b);
      a.V = V(d);
      if (null == a.V) return (a.Ta = null), (a.Ua = 0), (a.a = 1), 0;
      a.Ta = a.V;
      a.Ua = a.Ba + c + b;
      return 1;
    }
    function se(a, b) {
      var c = a.C,
        d = b - c,
        e = a.V,
        f = a.Ba + a.c * c;
      for (x(b <= a.l.o); 0 < d; ) {
        var g = 16 < d ? 16 : d,
          h = a.l.ma,
          k = a.l.width,
          l = k * g,
          m = h.ca,
          n = h.tb + k * c,
          r = a.Ta,
          q = a.Ua;
        oc(a, g, e, f);
        Fc(r, q, m, n, l);
        zc(h, c, c + g, m, n, k);
        d -= g;
        e += g * a.c;
        c += g;
      }
      x(c == b);
      a.C = a.Ma = b;
    }
    function te(a, b) {
      var c = [0],
        d = [0],
        e = [0];
      a: for (;;) {
        if (null == a) return 0;
        if (null == b) return (a.a = 2), 0;
        a.l = b;
        a.a = 0;
        cb(a.m, b.data, b.w, b.ha);
        if (!mc(a.m, c, d, e)) {
          a.a = 3;
          break a;
        }
        a.xb = Cc;
        b.width = c[0];
        b.height = d[0];
        if (!rb(c[0], d[0], 1, a, null)) break a;
        return 1;
      }
      x(0 != a.a);
      return 0;
    }
    function ue() {
      this.ub = this.yd = this.td = this.Rb = 0;
    }
    function ve() {
      this.Kd = this.Ld = this.Ud = this.Td = this.i = this.c = 0;
    }
    function we() {
      this.Fb = this.Bb = this.Cb = 0;
      this.Zb = V(4);
      this.Lb = V(4);
    }
    function Gc() {
      this.Yb = wb();
    }
    function xe() {
      this.jb = V(3);
      this.Wc = Ed([4, 8], Gc);
      this.Xc = Ed([4, 17], Gc);
    }
    function ye() {
      this.Pc = this.wb = this.Tb = this.zd = 0;
      this.vd = new V(4);
      this.od = new V(4);
    }
    function Xa() {
      this.ld = this.La = this.dd = this.tc = 0;
    }
    function Hc() {
      this.Na = this.la = 0;
    }
    function ze() {
      this.Sc = [0, 0];
      this.Eb = [0, 0];
      this.Qc = [0, 0];
      this.ia = this.lc = 0;
    }
    function Kb() {
      this.ad = V(384);
      this.Za = 0;
      this.Ob = V(16);
      this.$b = this.Ad = this.ia = this.Gc = this.Hc = this.Dd = 0;
    }
    function Ae() {
      this.uc = this.M = this.Nb = 0;
      this.wa = Array(new Xa());
      this.Y = 0;
      this.ya = Array(new Kb());
      this.aa = 0;
      this.l = new Oa();
    }
    function Ic() {
      this.y = V(16);
      this.f = V(8);
      this.ea = V(8);
    }
    function Be() {
      this.cb = this.a = 0;
      this.sc = "";
      this.m = new Wb();
      this.Od = new ue();
      this.Kc = new ve();
      this.ed = new ye();
      this.Qa = new we();
      this.Ic = this.$c = this.Aa = 0;
      this.D = new Ae();
      this.Xb = this.Va = this.Hb = this.zb = this.yb = this.Ub = this.za = 0;
      this.Jc = wa(8, Wb);
      this.ia = 0;
      new F();
      this.pb = wa(4, ze);
      this.Pa = new xe();
      this.Bd = this.kc = 0;
      this.Ac = [];
      this.Bc = 0;
      this.zc = [0, 0, 0, 0];
      this.Gd = Array(new Ic());
      this.Hd = 0;
      this.rb = Array(new Hc());
      this.sb = 0;
      this.wa = Array(new Xa());
      this.Y = 0;
      this.oc = [];
      this.pc = 0;
      this.sa = [];
      this.ta = 0;
      this.qa = [];
      this.ra = 0;
      this.Ha = [];
      this.B = this.R = this.Ia = 0;
      this.Ec = [];
      this.M = this.ja = this.Vb = this.Fc = 0;
      this.ya = Array(new Kb());
      this.L = this.aa = 0;
      this.gd = Ed([4, 2], Xa);
      this.ga = null;
      this.Fa = [];
      this.Cc = this.qc = this.P = 0;
      this.Gb = [];
      this.Uc = 0;
      this.mb = [];
      this.nb = 0;
      this.rc = [];
      this.Ga = this.Vc = 0;
    }
    function ga(a, b) {
      return 0 > a ? 0 : a > b ? b : a;
    }
    function Oa() {
      this.T = this.U = this.ka = this.height = this.width = 0;
      this.y = [];
      this.f = [];
      this.ea = [];
      this.Rc = this.fa = this.W = this.N = this.O = 0;
      this.ma = "void";
      this.put = "VP8IoPutHook";
      this.ac = "VP8IoSetupHook";
      this.bc = "VP8IoTeardownHook";
      this.ha = this.Kb = 0;
      this.data = [];
      this.hb = this.ib = this.da = this.o = this.j = this.va = this.v = this.Da = this.ob = this.w = 0;
      this.F = [];
      this.J = 0;
    }
    function Ce() {
      var a = new Be();
      null != a &&
        ((a.a = 0), (a.sc = "OK"), (a.cb = 0), (a.Xb = 0), oa || (oa = De));
      return a;
    }
    function T(a, b, c) {
      0 == a.a && ((a.a = b), (a.sc = c), (a.cb = 0));
      return 0;
    }
    function Jc(a, b, c) {
      return 3 <= c && 157 == a[b + 0] && 1 == a[b + 1] && 42 == a[b + 2];
    }
    function Kc(a, b) {
      if (null == a) return 0;
      a.a = 0;
      a.sc = "OK";
      if (null == b) return T(a, 2, "null VP8Io passed to VP8GetHeaders()");
      var c = b.data;
      var d = b.w;
      var e = b.ha;
      if (4 > e) return T(a, 7, "Truncated header.");
      var f = c[d + 0] | (c[d + 1] << 8) | (c[d + 2] << 16);
      var g = a.Od;
      g.Rb = !(f & 1);
      g.td = (f >> 1) & 7;
      g.yd = (f >> 4) & 1;
      g.ub = f >> 5;
      if (3 < g.td) return T(a, 3, "Incorrect keyframe parameters.");
      if (!g.yd) return T(a, 4, "Frame not displayable.");
      d += 3;
      e -= 3;
      var h = a.Kc;
      if (g.Rb) {
        if (7 > e) return T(a, 7, "cannot parse picture header");
        if (!Jc(c, d, e)) return T(a, 3, "Bad code word");
        h.c = ((c[d + 4] << 8) | c[d + 3]) & 16383;
        h.Td = c[d + 4] >> 6;
        h.i = ((c[d + 6] << 8) | c[d + 5]) & 16383;
        h.Ud = c[d + 6] >> 6;
        d += 7;
        e -= 7;
        a.za = (h.c + 15) >> 4;
        a.Ub = (h.i + 15) >> 4;
        b.width = h.c;
        b.height = h.i;
        b.Da = 0;
        b.j = 0;
        b.v = 0;
        b.va = b.width;
        b.o = b.height;
        b.da = 0;
        b.ib = b.width;
        b.hb = b.height;
        b.U = b.width;
        b.T = b.height;
        f = a.Pa;
        M(f.jb, 0, 255, f.jb.length);
        f = a.Qa;
        x(null != f);
        f.Cb = 0;
        f.Bb = 0;
        f.Fb = 1;
        M(f.Zb, 0, 0, f.Zb.length);
        M(f.Lb, 0, 0, f.Lb);
      }
      if (g.ub > e) return T(a, 7, "bad partition length");
      f = a.m;
      ma(f, c, d, g.ub);
      d += g.ub;
      e -= g.ub;
      g.Rb && ((h.Ld = G(f)), (h.Kd = G(f)));
      h = a.Qa;
      var k = a.Pa,
        l;
      x(null != f);
      x(null != h);
      h.Cb = G(f);
      if (h.Cb) {
        h.Bb = G(f);
        if (G(f)) {
          h.Fb = G(f);
          for (l = 0; 4 > l; ++l) h.Zb[l] = G(f) ? ca(f, 7) : 0;
          for (l = 0; 4 > l; ++l) h.Lb[l] = G(f) ? ca(f, 6) : 0;
        }
        if (h.Bb) for (l = 0; 3 > l; ++l) k.jb[l] = G(f) ? na(f, 8) : 255;
      } else h.Bb = 0;
      if (f.Ka) return T(a, 3, "cannot parse segment header");
      h = a.ed;
      h.zd = G(f);
      h.Tb = na(f, 6);
      h.wb = na(f, 3);
      h.Pc = G(f);
      if (h.Pc && G(f)) {
        for (k = 0; 4 > k; ++k) G(f) && (h.vd[k] = ca(f, 6));
        for (k = 0; 4 > k; ++k) G(f) && (h.od[k] = ca(f, 6));
      }
      a.L = 0 == h.Tb ? 0 : h.zd ? 1 : 2;
      if (f.Ka) return T(a, 3, "cannot parse filter header");
      l = d;
      var m = e;
      e = l;
      d = l + m;
      h = m;
      a.Xb = (1 << na(a.m, 2)) - 1;
      k = a.Xb;
      if (m < 3 * k) c = 7;
      else {
        l += 3 * k;
        h -= 3 * k;
        for (m = 0; m < k; ++m) {
          var n = c[e + 0] | (c[e + 1] << 8) | (c[e + 2] << 16);
          n > h && (n = h);
          ma(a.Jc[+m], c, l, n);
          l += n;
          h -= n;
          e += 3;
        }
        ma(a.Jc[+k], c, l, h);
        c = l < d ? 0 : 5;
      }
      if (0 != c) return T(a, c, "cannot parse partitions");
      l = a.m;
      c = na(l, 7);
      e = G(l) ? ca(l, 4) : 0;
      d = G(l) ? ca(l, 4) : 0;
      h = G(l) ? ca(l, 4) : 0;
      k = G(l) ? ca(l, 4) : 0;
      l = G(l) ? ca(l, 4) : 0;
      m = a.Qa;
      for (n = 0; 4 > n; ++n) {
        if (m.Cb) {
          var r = m.Zb[n];
          m.Fb || (r += c);
        } else if (0 < n) {
          a.pb[n] = a.pb[0];
          continue;
        } else r = c;
        var q = a.pb[n];
        q.Sc[0] = Lb[ga(r + e, 127)];
        q.Sc[1] = Mb[ga(r + 0, 127)];
        q.Eb[0] = 2 * Lb[ga(r + d, 127)];
        q.Eb[1] = (101581 * Mb[ga(r + h, 127)]) >> 16;
        8 > q.Eb[1] && (q.Eb[1] = 8);
        q.Qc[0] = Lb[ga(r + k, 117)];
        q.Qc[1] = Mb[ga(r + l, 127)];
        q.lc = r + l;
      }
      if (!g.Rb) return T(a, 4, "Not a key frame.");
      G(f);
      g = a.Pa;
      for (c = 0; 4 > c; ++c) {
        for (e = 0; 8 > e; ++e)
          for (d = 0; 3 > d; ++d)
            for (h = 0; 11 > h; ++h)
              (k = K(f, Ee[c][e][d][h]) ? na(f, 8) : Fe[c][e][d][h]),
                (g.Wc[c][e].Yb[d][h] = k);
        for (e = 0; 17 > e; ++e) g.Xc[c][e] = g.Wc[c][Ge[e]];
      }
      a.kc = G(f);
      a.kc && (a.Bd = na(f, 8));
      return (a.cb = 1);
    }
    function De(a, b, c, d, e, f, g) {
      var h = b[e].Yb[c];
      for (c = 0; 16 > e; ++e) {
        if (!K(a, h[c + 0])) return e;
        for (; !K(a, h[c + 1]); )
          if (((h = b[++e].Yb[0]), (c = 0), 16 == e)) return 16;
        var k = b[e + 1].Yb;
        if (K(a, h[c + 2])) {
          var l = a,
            m = h,
            n = c;
          var r = 0;
          if (K(l, m[n + 3]))
            if (K(l, m[n + 6])) {
              h = 0;
              r = K(l, m[n + 8]);
              m = K(l, m[n + 9 + r]);
              n = 2 * r + m;
              r = 0;
              for (m = He[n]; m[h]; ++h) r += r + K(l, m[h]);
              r += 3 + (8 << n);
            } else
              K(l, m[n + 7])
                ? ((r = 7 + 2 * K(l, 165)), (r += K(l, 145)))
                : (r = 5 + K(l, 159));
          else K(l, m[n + 4]) ? (r = 3 + K(l, m[n + 5])) : (r = 2);
          h = k[2];
        } else (r = 1), (h = k[1]);
        k = g + Ie[e];
        l = a;
        0 > l.b && Qa(l);
        var m = l.b,
          n = l.Ca >> 1,
          q = (n - (l.I >> m)) >> 31;
        --l.b;
        l.Ca += q;
        l.Ca |= 1;
        l.I -= ((n + 1) & q) << m;
        f[k] = ((r ^ q) - q) * d[(0 < e) + 0];
      }
      return 16;
    }
    function Lc(a) {
      var b = a.rb[a.sb - 1];
      b.la = 0;
      b.Na = 0;
      M(a.zc, 0, 0, a.zc.length);
      a.ja = 0;
    }
    function Je(a, b) {
      for (a.M = 0; a.M < a.Va; ++a.M) {
        var c = a.Jc[a.M & a.Xb],
          d = a.m,
          e = a,
          f;
        for (f = 0; f < e.za; ++f) {
          var g = d;
          var h = e;
          var k = h.Ac,
            l = h.Bc + 4 * f,
            m = h.zc,
            n = h.ya[h.aa + f];
          h.Qa.Bb
            ? (n.$b = K(g, h.Pa.jb[0])
                ? 2 + K(g, h.Pa.jb[2])
                : K(g, h.Pa.jb[1]))
            : (n.$b = 0);
          h.kc && (n.Ad = K(g, h.Bd));
          n.Za = !K(g, 145) + 0;
          if (n.Za) {
            var r = n.Ob,
              q = 0;
            for (h = 0; 4 > h; ++h) {
              var t = m[0 + h];
              var v;
              for (v = 0; 4 > v; ++v) {
                t = Ke[k[l + v]][t];
                for (var p = Mc[K(g, t[0])]; 0 < p; )
                  p = Mc[2 * p + K(g, t[p])];
                t = -p;
                k[l + v] = t;
              }
              I(r, q, k, l, 4);
              q += 4;
              m[0 + h] = t;
            }
          } else
            (t = K(g, 156) ? (K(g, 128) ? 1 : 3) : K(g, 163) ? 2 : 0),
              (n.Ob[0] = t),
              M(k, l, t, 4),
              M(m, 0, t, 4);
          n.Dd = K(g, 142) ? (K(g, 114) ? (K(g, 183) ? 1 : 3) : 2) : 0;
        }
        if (e.m.Ka) return T(a, 7, "Premature end-of-partition0 encountered.");
        for (; a.ja < a.za; ++a.ja) {
          d = a;
          e = c;
          g = d.rb[d.sb - 1];
          k = d.rb[d.sb + d.ja];
          f = d.ya[d.aa + d.ja];
          if ((l = d.kc ? f.Ad : 0))
            (g.la = k.la = 0),
              f.Za || (g.Na = k.Na = 0),
              (f.Hc = 0),
              (f.Gc = 0),
              (f.ia = 0);
          else {
            var u,
              w,
              g = k,
              k = e,
              l = d.Pa.Xc,
              m = d.ya[d.aa + d.ja],
              n = d.pb[m.$b];
            h = m.ad;
            r = 0;
            q = d.rb[d.sb - 1];
            t = v = 0;
            M(h, r, 0, 384);
            if (m.Za) {
              var y = 0;
              var A = l[3];
            } else {
              p = V(16);
              var E = g.Na + q.Na;
              E = oa(k, l[1], E, n.Eb, 0, p, 0);
              g.Na = q.Na = (0 < E) + 0;
              if (1 < E) Nc(p, 0, h, r);
              else {
                var B = (p[0] + 3) >> 3;
                for (p = 0; 256 > p; p += 16) h[r + p] = B;
              }
              y = 1;
              A = l[0];
            }
            var C = g.la & 15;
            var N = q.la & 15;
            for (p = 0; 4 > p; ++p) {
              var z = N & 1;
              for (B = w = 0; 4 > B; ++B)
                (E = z + (C & 1)),
                  (E = oa(k, A, E, n.Sc, y, h, r)),
                  (z = E > y),
                  (C = (C >> 1) | (z << 7)),
                  (w = (w << 2) | (3 < E ? 3 : 1 < E ? 2 : 0 != h[r + 0])),
                  (r += 16);
              C >>= 4;
              N = (N >> 1) | (z << 7);
              v = ((v << 8) | w) >>> 0;
            }
            A = C;
            y = N >> 4;
            for (u = 0; 4 > u; u += 2) {
              w = 0;
              C = g.la >> (4 + u);
              N = q.la >> (4 + u);
              for (p = 0; 2 > p; ++p) {
                z = N & 1;
                for (B = 0; 2 > B; ++B)
                  (E = z + (C & 1)),
                    (E = oa(k, l[2], E, n.Qc, 0, h, r)),
                    (z = 0 < E),
                    (C = (C >> 1) | (z << 3)),
                    (w = (w << 2) | (3 < E ? 3 : 1 < E ? 2 : 0 != h[r + 0])),
                    (r += 16);
                C >>= 2;
                N = (N >> 1) | (z << 5);
              }
              t |= w << (4 * u);
              A |= (C << 4) << u;
              y |= (N & 240) << u;
            }
            g.la = A;
            q.la = y;
            m.Hc = v;
            m.Gc = t;
            m.ia = t & 43690 ? 0 : n.ia;
            l = !(v | t);
          }
          0 < d.L &&
            ((d.wa[d.Y + d.ja] = d.gd[f.$b][f.Za]),
            (d.wa[d.Y + d.ja].La |= !l));
          if (e.Ka) return T(a, 7, "Premature end-of-file encountered.");
        }
        Lc(a);
        c = a;
        d = b;
        e = 1;
        f = c.D;
        g = 0 < c.L && c.M >= c.zb && c.M <= c.Va;
        if (0 == c.Aa)
          a: {
            (f.M = c.M), (f.uc = g), Oc(c, f), (e = 1);
            w = c.D;
            f = w.Nb;
            t = Ya[c.L];
            g = t * c.R;
            k = (t / 2) * c.B;
            p = 16 * f * c.R;
            B = 8 * f * c.B;
            l = c.sa;
            m = c.ta - g + p;
            n = c.qa;
            h = c.ra - k + B;
            r = c.Ha;
            q = c.Ia - k + B;
            C = w.M;
            N = 0 == C;
            v = C >= c.Va - 1;
            2 == c.Aa && Oc(c, w);
            if (w.uc)
              for (E = c, z = E.D.M, x(E.D.uc), w = E.yb; w < E.Hb; ++w) {
                var Q = E;
                y = w;
                A = z;
                var S = Q.D,
                  D = S.Nb;
                u = Q.R;
                var S = S.wa[S.Y + y],
                  F = Q.sa,
                  H = Q.ta + 16 * D * u + 16 * y,
                  J = S.dd,
                  G = S.tc;
                if (0 != G)
                  if ((x(3 <= G), 1 == Q.L))
                    0 < y && Pc(F, H, u, G + 4),
                      S.La && Qc(F, H, u, G),
                      0 < A && Rc(F, H, u, G + 4),
                      S.La && Sc(F, H, u, G);
                  else {
                    var L = Q.B,
                      O = Q.qa,
                      P = Q.ra + 8 * D * L + 8 * y,
                      R = Q.Ha,
                      Q = Q.Ia + 8 * D * L + 8 * y,
                      D = S.ld;
                    0 < y &&
                      (Tc(F, H, u, G + 4, J, D),
                      Uc(O, P, R, Q, L, G + 4, J, D));
                    S.La && (Vc(F, H, u, G, J, D), Wc(O, P, R, Q, L, G, J, D));
                    0 < A &&
                      (Xc(F, H, u, G + 4, J, D),
                      Yc(O, P, R, Q, L, G + 4, J, D));
                    S.La && (Zc(F, H, u, G, J, D), $c(O, P, R, Q, L, G, J, D));
                  }
              }
            c.ia && alert("todo:DitherRow");
            if (null != d.put) {
              w = 16 * C;
              C = 16 * (C + 1);
              N
                ? ((d.y = c.sa),
                  (d.O = c.ta + p),
                  (d.f = c.qa),
                  (d.N = c.ra + B),
                  (d.ea = c.Ha),
                  (d.W = c.Ia + B))
                : ((w -= t),
                  (d.y = l),
                  (d.O = m),
                  (d.f = n),
                  (d.N = h),
                  (d.ea = r),
                  (d.W = q));
              v || (C -= t);
              C > d.o && (C = d.o);
              d.F = null;
              d.J = null;
              if (
                null != c.Fa &&
                0 < c.Fa.length &&
                w < C &&
                ((d.J = Le(c, d, w, C - w)),
                (d.F = c.mb),
                null == d.F && 0 == d.F.length)
              ) {
                e = T(c, 3, "Could not decode alpha data.");
                break a;
              }
              w < d.j &&
                ((t = d.j - w),
                (w = d.j),
                x(!(t & 1)),
                (d.O += c.R * t),
                (d.N += c.B * (t >> 1)),
                (d.W += c.B * (t >> 1)),
                null != d.F && (d.J += d.width * t));
              w < C &&
                ((d.O += d.v),
                (d.N += d.v >> 1),
                (d.W += d.v >> 1),
                null != d.F && (d.J += d.v),
                (d.ka = w - d.j),
                (d.U = d.va - d.v),
                (d.T = C - w),
                (e = d.put(d)));
            }
            f + 1 != c.Ic ||
              v ||
              (I(c.sa, c.ta - g, l, m + 16 * c.R, g),
              I(c.qa, c.ra - k, n, h + 8 * c.B, k),
              I(c.Ha, c.Ia - k, r, q + 8 * c.B, k));
          }
        if (!e) return T(a, 6, "Output aborted.");
      }
      return 1;
    }
    function Me(a, b) {
      if (null == a) return 0;
      if (null == b) return T(a, 2, "NULL VP8Io parameter in VP8Decode().");
      if (!a.cb && !Kc(a, b)) return 0;
      x(a.cb);
      if (null == b.ac || b.ac(b)) {
        b.ob && (a.L = 0);
        var c = Ya[a.L];
        2 == a.L
          ? ((a.yb = 0), (a.zb = 0))
          : ((a.yb = (b.v - c) >> 4),
            (a.zb = (b.j - c) >> 4),
            0 > a.yb && (a.yb = 0),
            0 > a.zb && (a.zb = 0));
        a.Va = (b.o + 15 + c) >> 4;
        a.Hb = (b.va + 15 + c) >> 4;
        a.Hb > a.za && (a.Hb = a.za);
        a.Va > a.Ub && (a.Va = a.Ub);
        if (0 < a.L) {
          var d = a.ed;
          for (c = 0; 4 > c; ++c) {
            var e;
            if (a.Qa.Cb) {
              var f = a.Qa.Lb[c];
              a.Qa.Fb || (f += d.Tb);
            } else f = d.Tb;
            for (e = 0; 1 >= e; ++e) {
              var g = a.gd[c][e],
                h = f;
              d.Pc && ((h += d.vd[0]), e && (h += d.od[0]));
              h = 0 > h ? 0 : 63 < h ? 63 : h;
              if (0 < h) {
                var k = h;
                0 < d.wb &&
                  ((k = 4 < d.wb ? k >> 2 : k >> 1),
                  k > 9 - d.wb && (k = 9 - d.wb));
                1 > k && (k = 1);
                g.dd = k;
                g.tc = 2 * h + k;
                g.ld = 40 <= h ? 2 : 15 <= h ? 1 : 0;
              } else g.tc = 0;
              g.La = e;
            }
          }
        }
        c = 0;
      } else T(a, 6, "Frame setup failed"), (c = a.a);
      if ((c = 0 == c)) {
        if (c) {
          a.$c = 0;
          0 < a.Aa || (a.Ic = Ne);
          b: {
            c = a.Ic;
            var k = a.za,
              d = 4 * k,
              l = 32 * k,
              m = k + 1,
              n = 0 < a.L ? k * (0 < a.Aa ? 2 : 1) : 0,
              r = (2 == a.Aa ? 2 : 1) * k;
            e = ((3 * (16 * c + Ya[a.L])) / 2) * l;
            f = null != a.Fa && 0 < a.Fa.length ? a.Kc.c * a.Kc.i : 0;
            g = d + 832 + e + f;
            if (g != g) c = 0;
            else {
              if (g > a.Vb) {
                a.Vb = 0;
                a.Ec = V(g);
                a.Fc = 0;
                if (null == a.Ec) {
                  c = T(a, 1, "no memory during frame initialization.");
                  break b;
                }
                a.Vb = g;
              }
              g = a.Ec;
              h = a.Fc;
              a.Ac = g;
              a.Bc = h;
              h += d;
              a.Gd = wa(l, Ic);
              a.Hd = 0;
              a.rb = wa(m + 1, Hc);
              a.sb = 1;
              a.wa = n ? wa(n, Xa) : null;
              a.Y = 0;
              a.D.Nb = 0;
              a.D.wa = a.wa;
              a.D.Y = a.Y;
              0 < a.Aa && (a.D.Y += k);
              x(!0);
              a.oc = g;
              a.pc = h;
              h += 832;
              a.ya = wa(r, Kb);
              a.aa = 0;
              a.D.ya = a.ya;
              a.D.aa = a.aa;
              2 == a.Aa && (a.D.aa += k);
              a.R = 16 * k;
              a.B = 8 * k;
              l = Ya[a.L];
              k = l * a.R;
              l = (l / 2) * a.B;
              a.sa = g;
              a.ta = h + k;
              a.qa = a.sa;
              a.ra = a.ta + 16 * c * a.R + l;
              a.Ha = a.qa;
              a.Ia = a.ra + 8 * c * a.B + l;
              a.$c = 0;
              h += e;
              a.mb = f ? g : null;
              a.nb = f ? h : null;
              x(h + f <= a.Fc + a.Vb);
              Lc(a);
              M(a.Ac, a.Bc, 0, d);
              c = 1;
            }
          }
          if (c) {
            b.ka = 0;
            b.y = a.sa;
            b.O = a.ta;
            b.f = a.qa;
            b.N = a.ra;
            b.ea = a.Ha;
            b.Vd = a.Ia;
            b.fa = a.R;
            b.Rc = a.B;
            b.F = null;
            b.J = 0;
            if (!ad) {
              for (c = -255; 255 >= c; ++c) bd[255 + c] = 0 > c ? -c : c;
              for (c = -1020; 1020 >= c; ++c)
                cd[1020 + c] = -128 > c ? -128 : 127 < c ? 127 : c;
              for (c = -112; 112 >= c; ++c)
                dd[112 + c] = -16 > c ? -16 : 15 < c ? 15 : c;
              for (c = -255; 510 >= c; ++c)
                ed[255 + c] = 0 > c ? 0 : 255 < c ? 255 : c;
              ad = 1;
            }
            Nc = Oe;
            Za = Pe;
            Nb = Qe;
            pa = Re;
            Ob = Se;
            fd = Te;
            Xc = Ue;
            Tc = Ve;
            Yc = We;
            Uc = Xe;
            Zc = Ye;
            Vc = Ze;
            $c = $e;
            Wc = af;
            Rc = gd;
            Pc = hd;
            Sc = bf;
            Qc = cf;
            W[0] = df;
            W[1] = ef;
            W[2] = ff;
            W[3] = gf;
            W[4] = hf;
            W[5] = jf;
            W[6] = kf;
            W[7] = lf;
            W[8] = mf;
            W[9] = nf;
            Y[0] = of;
            Y[1] = pf;
            Y[2] = qf;
            Y[3] = rf;
            Y[4] = sf;
            Y[5] = tf;
            Y[6] = uf;
            ka[0] = vf;
            ka[1] = wf;
            ka[2] = xf;
            ka[3] = yf;
            ka[4] = zf;
            ka[5] = Af;
            ka[6] = Bf;
            c = 1;
          } else c = 0;
        }
        c && (c = Je(a, b));
        null != b.bc && b.bc(b);
        c &= 1;
      }
      if (!c) return 0;
      a.cb = 0;
      return c;
    }
    function qa(a, b, c, d, e) {
      e = a[b + c + 32 * d] + (e >> 3);
      a[b + c + 32 * d] = e & -256 ? (0 > e ? 0 : 255) : e;
    }
    function kb(a, b, c, d, e, f) {
      qa(a, b, 0, c, d + e);
      qa(a, b, 1, c, d + f);
      qa(a, b, 2, c, d - f);
      qa(a, b, 3, c, d - e);
    }
    function da(a) {
      return ((20091 * a) >> 16) + a;
    }
    function id(a, b, c, d) {
      var e = 0,
        f;
      var g = V(16);
      for (f = 0; 4 > f; ++f) {
        var h = a[b + 0] + a[b + 8];
        var k = a[b + 0] - a[b + 8];
        var l = ((35468 * a[b + 4]) >> 16) - da(a[b + 12]);
        var m = da(a[b + 4]) + ((35468 * a[b + 12]) >> 16);
        g[e + 0] = h + m;
        g[e + 1] = k + l;
        g[e + 2] = k - l;
        g[e + 3] = h - m;
        e += 4;
        b++;
      }
      for (f = e = 0; 4 > f; ++f)
        (a = g[e + 0] + 4),
          (h = a + g[e + 8]),
          (k = a - g[e + 8]),
          (l = ((35468 * g[e + 4]) >> 16) - da(g[e + 12])),
          (m = da(g[e + 4]) + ((35468 * g[e + 12]) >> 16)),
          qa(c, d, 0, 0, h + m),
          qa(c, d, 1, 0, k + l),
          qa(c, d, 2, 0, k - l),
          qa(c, d, 3, 0, h - m),
          e++,
          (d += 32);
    }
    function Te(a, b, c, d) {
      var e = a[b + 0] + 4,
        f = (35468 * a[b + 4]) >> 16,
        g = da(a[b + 4]),
        h = (35468 * a[b + 1]) >> 16;
      a = da(a[b + 1]);
      kb(c, d, 0, e + g, a, h);
      kb(c, d, 1, e + f, a, h);
      kb(c, d, 2, e - f, a, h);
      kb(c, d, 3, e - g, a, h);
    }
    function Pe(a, b, c, d, e) {
      id(a, b, c, d);
      e && id(a, b + 16, c, d + 4);
    }
    function Qe(a, b, c, d) {
      Za(a, b + 0, c, d, 1);
      Za(a, b + 32, c, d + 128, 1);
    }
    function Re(a, b, c, d) {
      a = a[b + 0] + 4;
      var e;
      for (e = 0; 4 > e; ++e) for (b = 0; 4 > b; ++b) qa(c, d, b, e, a);
    }
    function Se(a, b, c, d) {
      a[b + 0] && pa(a, b + 0, c, d);
      a[b + 16] && pa(a, b + 16, c, d + 4);
      a[b + 32] && pa(a, b + 32, c, d + 128);
      a[b + 48] && pa(a, b + 48, c, d + 128 + 4);
    }
    function Oe(a, b, c, d) {
      var e = V(16),
        f;
      for (f = 0; 4 > f; ++f) {
        var g = a[b + 0 + f] + a[b + 12 + f];
        var h = a[b + 4 + f] + a[b + 8 + f];
        var k = a[b + 4 + f] - a[b + 8 + f];
        var l = a[b + 0 + f] - a[b + 12 + f];
        e[0 + f] = g + h;
        e[8 + f] = g - h;
        e[4 + f] = l + k;
        e[12 + f] = l - k;
      }
      for (f = 0; 4 > f; ++f)
        (a = e[0 + 4 * f] + 3),
          (g = a + e[3 + 4 * f]),
          (h = e[1 + 4 * f] + e[2 + 4 * f]),
          (k = e[1 + 4 * f] - e[2 + 4 * f]),
          (l = a - e[3 + 4 * f]),
          (c[d + 0] = (g + h) >> 3),
          (c[d + 16] = (l + k) >> 3),
          (c[d + 32] = (g - h) >> 3),
          (c[d + 48] = (l - k) >> 3),
          (d += 64);
    }
    function Pb(a, b, c) {
      var d = b - 32,
        e = R,
        f = 255 - a[d - 1],
        g;
      for (g = 0; g < c; ++g) {
        var h = e,
          k = f + a[b - 1],
          l;
        for (l = 0; l < c; ++l) a[b + l] = h[k + a[d + l]];
        b += 32;
      }
    }
    function ef(a, b) {
      Pb(a, b, 4);
    }
    function wf(a, b) {
      Pb(a, b, 8);
    }
    function pf(a, b) {
      Pb(a, b, 16);
    }
    function qf(a, b) {
      var c;
      for (c = 0; 16 > c; ++c) I(a, b + 32 * c, a, b - 32, 16);
    }
    function rf(a, b) {
      var c;
      for (c = 16; 0 < c; --c) M(a, b, a[b - 1], 16), (b += 32);
    }
    function $a(a, b, c) {
      var d;
      for (d = 0; 16 > d; ++d) M(b, c + 32 * d, a, 16);
    }
    function of(a, b) {
      var c = 16,
        d;
      for (d = 0; 16 > d; ++d) c += a[b - 1 + 32 * d] + a[b + d - 32];
      $a(c >> 5, a, b);
    }
    function sf(a, b) {
      var c = 8,
        d;
      for (d = 0; 16 > d; ++d) c += a[b - 1 + 32 * d];
      $a(c >> 4, a, b);
    }
    function tf(a, b) {
      var c = 8,
        d;
      for (d = 0; 16 > d; ++d) c += a[b + d - 32];
      $a(c >> 4, a, b);
    }
    function uf(a, b) {
      $a(128, a, b);
    }
    function z(a, b, c) {
      return (a + 2 * b + c + 2) >> 2;
    }
    function ff(a, b) {
      var c = b - 32,
        c = new Uint8Array([
          z(a[c - 1], a[c + 0], a[c + 1]),
          z(a[c + 0], a[c + 1], a[c + 2]),
          z(a[c + 1], a[c + 2], a[c + 3]),
          z(a[c + 2], a[c + 3], a[c + 4])
        ]),
        d;
      for (d = 0; 4 > d; ++d) I(a, b + 32 * d, c, 0, c.length);
    }
    function gf(a, b) {
      var c = a[b - 1],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 + 96];
      ra(a, b + 0, 16843009 * z(a[b - 1 - 32], c, d));
      ra(a, b + 32, 16843009 * z(c, d, e));
      ra(a, b + 64, 16843009 * z(d, e, f));
      ra(a, b + 96, 16843009 * z(e, f, f));
    }
    function df(a, b) {
      var c = 4,
        d;
      for (d = 0; 4 > d; ++d) c += a[b + d - 32] + a[b - 1 + 32 * d];
      c >>= 3;
      for (d = 0; 4 > d; ++d) M(a, b + 32 * d, c, 4);
    }
    function hf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 - 32],
        g = a[b + 0 - 32],
        h = a[b + 1 - 32],
        k = a[b + 2 - 32],
        l = a[b + 3 - 32];
      a[b + 0 + 96] = z(d, e, a[b - 1 + 96]);
      a[b + 1 + 96] = a[b + 0 + 64] = z(c, d, e);
      a[b + 2 + 96] = a[b + 1 + 64] = a[b + 0 + 32] = z(f, c, d);
      a[b + 3 + 96] = a[b + 2 + 64] = a[b + 1 + 32] = a[b + 0 + 0] = z(g, f, c);
      a[b + 3 + 64] = a[b + 2 + 32] = a[b + 1 + 0] = z(h, g, f);
      a[b + 3 + 32] = a[b + 2 + 0] = z(k, h, g);
      a[b + 3 + 0] = z(l, k, h);
    }
    function kf(a, b) {
      var c = a[b + 1 - 32],
        d = a[b + 2 - 32],
        e = a[b + 3 - 32],
        f = a[b + 4 - 32],
        g = a[b + 5 - 32],
        h = a[b + 6 - 32],
        k = a[b + 7 - 32];
      a[b + 0 + 0] = z(a[b + 0 - 32], c, d);
      a[b + 1 + 0] = a[b + 0 + 32] = z(c, d, e);
      a[b + 2 + 0] = a[b + 1 + 32] = a[b + 0 + 64] = z(d, e, f);
      a[b + 3 + 0] = a[b + 2 + 32] = a[b + 1 + 64] = a[b + 0 + 96] = z(e, f, g);
      a[b + 3 + 32] = a[b + 2 + 64] = a[b + 1 + 96] = z(f, g, h);
      a[b + 3 + 64] = a[b + 2 + 96] = z(g, h, k);
      a[b + 3 + 96] = z(h, k, k);
    }
    function jf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 - 32],
        g = a[b + 0 - 32],
        h = a[b + 1 - 32],
        k = a[b + 2 - 32],
        l = a[b + 3 - 32];
      a[b + 0 + 0] = a[b + 1 + 64] = (f + g + 1) >> 1;
      a[b + 1 + 0] = a[b + 2 + 64] = (g + h + 1) >> 1;
      a[b + 2 + 0] = a[b + 3 + 64] = (h + k + 1) >> 1;
      a[b + 3 + 0] = (k + l + 1) >> 1;
      a[b + 0 + 96] = z(e, d, c);
      a[b + 0 + 64] = z(d, c, f);
      a[b + 0 + 32] = a[b + 1 + 96] = z(c, f, g);
      a[b + 1 + 32] = a[b + 2 + 96] = z(f, g, h);
      a[b + 2 + 32] = a[b + 3 + 96] = z(g, h, k);
      a[b + 3 + 32] = z(h, k, l);
    }
    function lf(a, b) {
      var c = a[b + 0 - 32],
        d = a[b + 1 - 32],
        e = a[b + 2 - 32],
        f = a[b + 3 - 32],
        g = a[b + 4 - 32],
        h = a[b + 5 - 32],
        k = a[b + 6 - 32],
        l = a[b + 7 - 32];
      a[b + 0 + 0] = (c + d + 1) >> 1;
      a[b + 1 + 0] = a[b + 0 + 64] = (d + e + 1) >> 1;
      a[b + 2 + 0] = a[b + 1 + 64] = (e + f + 1) >> 1;
      a[b + 3 + 0] = a[b + 2 + 64] = (f + g + 1) >> 1;
      a[b + 0 + 32] = z(c, d, e);
      a[b + 1 + 32] = a[b + 0 + 96] = z(d, e, f);
      a[b + 2 + 32] = a[b + 1 + 96] = z(e, f, g);
      a[b + 3 + 32] = a[b + 2 + 96] = z(f, g, h);
      a[b + 3 + 64] = z(g, h, k);
      a[b + 3 + 96] = z(h, k, l);
    }
    function nf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 + 96];
      a[b + 0 + 0] = (c + d + 1) >> 1;
      a[b + 2 + 0] = a[b + 0 + 32] = (d + e + 1) >> 1;
      a[b + 2 + 32] = a[b + 0 + 64] = (e + f + 1) >> 1;
      a[b + 1 + 0] = z(c, d, e);
      a[b + 3 + 0] = a[b + 1 + 32] = z(d, e, f);
      a[b + 3 + 32] = a[b + 1 + 64] = z(e, f, f);
      a[b + 3 + 64] = a[b + 2 + 64] = a[b + 0 + 96] = a[b + 1 + 96] = a[
        b + 2 + 96
      ] = a[b + 3 + 96] = f;
    }
    function mf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 + 96],
        g = a[b - 1 - 32],
        h = a[b + 0 - 32],
        k = a[b + 1 - 32],
        l = a[b + 2 - 32];
      a[b + 0 + 0] = a[b + 2 + 32] = (c + g + 1) >> 1;
      a[b + 0 + 32] = a[b + 2 + 64] = (d + c + 1) >> 1;
      a[b + 0 + 64] = a[b + 2 + 96] = (e + d + 1) >> 1;
      a[b + 0 + 96] = (f + e + 1) >> 1;
      a[b + 3 + 0] = z(h, k, l);
      a[b + 2 + 0] = z(g, h, k);
      a[b + 1 + 0] = a[b + 3 + 32] = z(c, g, h);
      a[b + 1 + 32] = a[b + 3 + 64] = z(d, c, g);
      a[b + 1 + 64] = a[b + 3 + 96] = z(e, d, c);
      a[b + 1 + 96] = z(f, e, d);
    }
    function xf(a, b) {
      var c;
      for (c = 0; 8 > c; ++c) I(a, b + 32 * c, a, b - 32, 8);
    }
    function yf(a, b) {
      var c;
      for (c = 0; 8 > c; ++c) M(a, b, a[b - 1], 8), (b += 32);
    }
    function lb(a, b, c) {
      var d;
      for (d = 0; 8 > d; ++d) M(b, c + 32 * d, a, 8);
    }
    function vf(a, b) {
      var c = 8,
        d;
      for (d = 0; 8 > d; ++d) c += a[b + d - 32] + a[b - 1 + 32 * d];
      lb(c >> 4, a, b);
    }
    function Af(a, b) {
      var c = 4,
        d;
      for (d = 0; 8 > d; ++d) c += a[b + d - 32];
      lb(c >> 3, a, b);
    }
    function zf(a, b) {
      var c = 4,
        d;
      for (d = 0; 8 > d; ++d) c += a[b - 1 + 32 * d];
      lb(c >> 3, a, b);
    }
    function Bf(a, b) {
      lb(128, a, b);
    }
    function ab(a, b, c) {
      var d = a[b - c],
        e = a[b + 0],
        f = 3 * (e - d) + Qb[1020 + a[b - 2 * c] - a[b + c]],
        g = mb[112 + ((f + 4) >> 3)];
      a[b - c] = R[255 + d + mb[112 + ((f + 3) >> 3)]];
      a[b + 0] = R[255 + e - g];
    }
    function jd(a, b, c, d) {
      var e = a[b + 0],
        f = a[b + c];
      return U[255 + a[b - 2 * c] - a[b - c]] > d || U[255 + f - e] > d;
    }
    function kd(a, b, c, d) {
      return (
        4 * U[255 + a[b - c] - a[b + 0]] + U[255 + a[b - 2 * c] - a[b + c]] <= d
      );
    }
    function ld(a, b, c, d, e) {
      var f = a[b - 3 * c],
        g = a[b - 2 * c],
        h = a[b - c],
        k = a[b + 0],
        l = a[b + c],
        m = a[b + 2 * c],
        n = a[b + 3 * c];
      return 4 * U[255 + h - k] + U[255 + g - l] > d
        ? 0
        : U[255 + a[b - 4 * c] - f] <= e &&
            U[255 + f - g] <= e &&
            U[255 + g - h] <= e &&
            U[255 + n - m] <= e &&
            U[255 + m - l] <= e &&
            U[255 + l - k] <= e;
    }
    function gd(a, b, c, d) {
      var e = 2 * d + 1;
      for (d = 0; 16 > d; ++d) kd(a, b + d, c, e) && ab(a, b + d, c);
    }
    function hd(a, b, c, d) {
      var e = 2 * d + 1;
      for (d = 0; 16 > d; ++d) kd(a, b + d * c, 1, e) && ab(a, b + d * c, 1);
    }
    function bf(a, b, c, d) {
      var e;
      for (e = 3; 0 < e; --e) (b += 4 * c), gd(a, b, c, d);
    }
    function cf(a, b, c, d) {
      var e;
      for (e = 3; 0 < e; --e) (b += 4), hd(a, b, c, d);
    }
    function ea(a, b, c, d, e, f, g, h) {
      for (f = 2 * f + 1; 0 < e--; ) {
        if (ld(a, b, c, f, g))
          if (jd(a, b, c, h)) ab(a, b, c);
          else {
            var k = a,
              l = b,
              m = c,
              n = k[l - 2 * m],
              r = k[l - m],
              q = k[l + 0],
              t = k[l + m],
              v = k[l + 2 * m],
              p = Qb[1020 + 3 * (q - r) + Qb[1020 + n - t]],
              u = (27 * p + 63) >> 7,
              w = (18 * p + 63) >> 7,
              p = (9 * p + 63) >> 7;
            k[l - 3 * m] = R[255 + k[l - 3 * m] + p];
            k[l - 2 * m] = R[255 + n + w];
            k[l - m] = R[255 + r + u];
            k[l + 0] = R[255 + q - u];
            k[l + m] = R[255 + t - w];
            k[l + 2 * m] = R[255 + v - p];
          }
        b += d;
      }
    }
    function Fa(a, b, c, d, e, f, g, h) {
      for (f = 2 * f + 1; 0 < e--; ) {
        if (ld(a, b, c, f, g))
          if (jd(a, b, c, h)) ab(a, b, c);
          else {
            var k = a,
              l = b,
              m = c,
              n = k[l - m],
              r = k[l + 0],
              q = k[l + m],
              t = 3 * (r - n),
              v = mb[112 + ((t + 4) >> 3)],
              t = mb[112 + ((t + 3) >> 3)],
              p = (v + 1) >> 1;
            k[l - 2 * m] = R[255 + k[l - 2 * m] + p];
            k[l - m] = R[255 + n + t];
            k[l + 0] = R[255 + r - v];
            k[l + m] = R[255 + q - p];
          }
        b += d;
      }
    }
    function Ue(a, b, c, d, e, f) {
      ea(a, b, c, 1, 16, d, e, f);
    }
    function Ve(a, b, c, d, e, f) {
      ea(a, b, 1, c, 16, d, e, f);
    }
    function Ye(a, b, c, d, e, f) {
      var g;
      for (g = 3; 0 < g; --g) (b += 4 * c), Fa(a, b, c, 1, 16, d, e, f);
    }
    function Ze(a, b, c, d, e, f) {
      var g;
      for (g = 3; 0 < g; --g) (b += 4), Fa(a, b, 1, c, 16, d, e, f);
    }
    function We(a, b, c, d, e, f, g, h) {
      ea(a, b, e, 1, 8, f, g, h);
      ea(c, d, e, 1, 8, f, g, h);
    }
    function Xe(a, b, c, d, e, f, g, h) {
      ea(a, b, 1, e, 8, f, g, h);
      ea(c, d, 1, e, 8, f, g, h);
    }
    function $e(a, b, c, d, e, f, g, h) {
      Fa(a, b + 4 * e, e, 1, 8, f, g, h);
      Fa(c, d + 4 * e, e, 1, 8, f, g, h);
    }
    function af(a, b, c, d, e, f, g, h) {
      Fa(a, b + 4, 1, e, 8, f, g, h);
      Fa(c, d + 4, 1, e, 8, f, g, h);
    }
    function Cf() {
      this.ba = new Cb();
      this.ec = [];
      this.cc = [];
      this.Mc = [];
      this.Dc = this.Nc = this.dc = this.fc = 0;
      this.Oa = new Ud();
      this.memory = 0;
      this.Ib = "OutputFunc";
      this.Jb = "OutputAlphaFunc";
      this.Nd = "OutputRowFunc";
    }
    function md() {
      this.data = [];
      this.offset = this.kd = this.ha = this.w = 0;
      this.na = [];
      this.xa = this.gb = this.Ja = this.Sa = this.P = 0;
    }
    function Df() {
      this.nc = this.Ea = this.b = this.hc = 0;
      this.K = [];
      this.w = 0;
    }
    function Ef() {
      this.ua = 0;
      this.Wa = new ac();
      this.vb = new ac();
      this.md = this.xc = this.wc = 0;
      this.vc = [];
      this.Wb = 0;
      this.Ya = new Ub();
      this.yc = new O();
    }
    function je() {
      this.xb = this.a = 0;
      this.l = new Oa();
      this.ca = new Cb();
      this.V = [];
      this.Ba = 0;
      this.Ta = [];
      this.Ua = 0;
      this.m = new Ra();
      this.Pb = 0;
      this.wd = new Ra();
      this.Ma = this.$ = this.C = this.i = this.c = this.xd = 0;
      this.s = new Ef();
      this.ab = 0;
      this.gc = wa(4, Df);
      this.Oc = 0;
    }
    function Ff() {
      this.Lc = this.Z = this.$a = this.i = this.c = 0;
      this.l = new Oa();
      this.ic = 0;
      this.ca = [];
      this.tb = 0;
      this.qd = null;
      this.rd = 0;
    }
    function Rb(a, b, c, d, e, f, g) {
      a = null == a ? 0 : a[b + 0];
      for (b = 0; b < g; ++b) (e[f + b] = (a + c[d + b]) & 255), (a = e[f + b]);
    }
    function Gf(a, b, c, d, e, f, g) {
      if (null == a) Rb(null, null, c, d, e, f, g);
      else {
        var h;
        for (h = 0; h < g; ++h) e[f + h] = (a[b + h] + c[d + h]) & 255;
      }
    }
    function Hf(a, b, c, d, e, f, g) {
      if (null == a) Rb(null, null, c, d, e, f, g);
      else {
        var h = a[b + 0],
          k = h,
          l = h,
          m;
        for (m = 0; m < g; ++m)
          (h = a[b + m]),
            (k = l + h - k),
            (l = (c[d + m] + (k & -256 ? (0 > k ? 0 : 255) : k)) & 255),
            (k = h),
            (e[f + m] = l);
      }
    }
    function Le(a, b, c, d) {
      var e = b.width,
        f = b.o;
      x(null != a && null != b);
      if (0 > c || 0 >= d || c + d > f) return null;
      if (!a.Cc) {
        if (null == a.ga) {
          a.ga = new Ff();
          var g;
          (g = null == a.ga) ||
            ((g = b.width * b.o),
            x(0 == a.Gb.length),
            (a.Gb = V(g)),
            (a.Uc = 0),
            null == a.Gb
              ? (g = 0)
              : ((a.mb = a.Gb), (a.nb = a.Uc), (a.rc = null), (g = 1)),
            (g = !g));
          if (!g) {
            g = a.ga;
            var h = a.Fa,
              k = a.P,
              l = a.qc,
              m = a.mb,
              n = a.nb,
              r = k + 1,
              q = l - 1,
              t = g.l;
            x(null != h && null != m && null != b);
            ia[0] = null;
            ia[1] = Rb;
            ia[2] = Gf;
            ia[3] = Hf;
            g.ca = m;
            g.tb = n;
            g.c = b.width;
            g.i = b.height;
            x(0 < g.c && 0 < g.i);
            if (1 >= l) b = 0;
            else if (
              ((g.$a = (h[k + 0] >> 0) & 3),
              (g.Z = (h[k + 0] >> 2) & 3),
              (g.Lc = (h[k + 0] >> 4) & 3),
              (k = (h[k + 0] >> 6) & 3),
              0 > g.$a || 1 < g.$a || 4 <= g.Z || 1 < g.Lc || k)
            )
              b = 0;
            else if (
              ((t.put = kc),
              (t.ac = gc),
              (t.bc = lc),
              (t.ma = g),
              (t.width = b.width),
              (t.height = b.height),
              (t.Da = b.Da),
              (t.v = b.v),
              (t.va = b.va),
              (t.j = b.j),
              (t.o = b.o),
              g.$a)
            )
              b: {
                x(1 == g.$a), (b = Bc());
                c: for (;;) {
                  if (null == b) {
                    b = 0;
                    break b;
                  }
                  x(null != g);
                  g.mc = b;
                  b.c = g.c;
                  b.i = g.i;
                  b.l = g.l;
                  b.l.ma = g;
                  b.l.width = g.c;
                  b.l.height = g.i;
                  b.a = 0;
                  cb(b.m, h, r, q);
                  if (!rb(g.c, g.i, 1, b, null)) break c;
                  1 == b.ab && 3 == b.gc[0].hc && yc(b.s)
                    ? ((g.ic = 1),
                      (h = b.c * b.i),
                      (b.Ta = null),
                      (b.Ua = 0),
                      (b.V = V(h)),
                      (b.Ba = 0),
                      null == b.V ? ((b.a = 1), (b = 0)) : (b = 1))
                    : ((g.ic = 0), (b = Ec(b, g.c)));
                  if (!b) break c;
                  b = 1;
                  break b;
                }
                g.mc = null;
                b = 0;
              }
            else b = q >= g.c * g.i;
            g = !b;
          }
          if (g) return null;
          1 != a.ga.Lc ? (a.Ga = 0) : (d = f - c);
        }
        x(null != a.ga);
        x(c + d <= f);
        a: {
          h = a.ga;
          b = h.c;
          f = h.l.o;
          if (0 == h.$a) {
            r = a.rc;
            q = a.Vc;
            t = a.Fa;
            k = a.P + 1 + c * b;
            l = a.mb;
            m = a.nb + c * b;
            x(k <= a.P + a.qc);
            if (0 != h.Z)
              for (x(null != ia[h.Z]), g = 0; g < d; ++g)
                ia[h.Z](r, q, t, k, l, m, b),
                  (r = l),
                  (q = m),
                  (m += b),
                  (k += b);
            else
              for (g = 0; g < d; ++g)
                I(l, m, t, k, b), (r = l), (q = m), (m += b), (k += b);
            a.rc = r;
            a.Vc = q;
          } else {
            x(null != h.mc);
            b = c + d;
            g = h.mc;
            x(null != g);
            x(b <= g.i);
            if (g.C >= b) b = 1;
            else if ((h.ic || Aa(), h.ic)) {
              var h = g.V,
                r = g.Ba,
                q = g.c,
                v = g.i,
                t = 1,
                k = g.$ / q,
                l = g.$ % q,
                m = g.m,
                n = g.s,
                p = g.$,
                u = q * v,
                w = q * b,
                y = n.wc,
                A = p < w ? ha(n, l, k) : null;
              x(p <= u);
              x(b <= v);
              x(yc(n));
              c: for (;;) {
                for (; !m.h && p < w; ) {
                  l & y || (A = ha(n, l, k));
                  x(null != A);
                  Sa(m);
                  v = ua(A.G[0], A.H[0], m);
                  if (256 > v)
                    (h[r + p] = v),
                      ++p,
                      ++l,
                      l >= q && ((l = 0), ++k, k <= b && !(k % 16) && Ib(g, k));
                  else if (280 > v) {
                    var v = ib(v - 256, m);
                    var E = ua(A.G[4], A.H[4], m);
                    Sa(m);
                    E = ib(E, m);
                    E = nc(q, E);
                    if (p >= E && u - p >= v) {
                      var B;
                      for (B = 0; B < v; ++B) h[r + p + B] = h[r + p + B - E];
                    } else {
                      t = 0;
                      break c;
                    }
                    p += v;
                    for (l += v; l >= q; )
                      (l -= q), ++k, k <= b && !(k % 16) && Ib(g, k);
                    p < w && l & y && (A = ha(n, l, k));
                  } else {
                    t = 0;
                    break c;
                  }
                  x(m.h == db(m));
                }
                Ib(g, k > b ? b : k);
                break c;
              }
              !t || (m.h && p < u) ? ((t = 0), (g.a = m.h ? 5 : 3)) : (g.$ = p);
              b = t;
            } else b = Jb(g, g.V, g.Ba, g.c, g.i, b, se);
            if (!b) {
              d = 0;
              break a;
            }
          }
          c + d >= f && (a.Cc = 1);
          d = 1;
        }
        if (!d) return null;
        if (
          a.Cc &&
          ((d = a.ga), null != d && (d.mc = null), (a.ga = null), 0 < a.Ga)
        )
          return alert("todo:WebPDequantizeLevels"), null;
      }
      return a.nb + c * e;
    }
    function If(a, b, c, d, e, f) {
      for (; 0 < e--; ) {
        var g = a,
          h = b + (c ? 1 : 0),
          k = a,
          l = b + (c ? 0 : 3),
          m;
        for (m = 0; m < d; ++m) {
          var n = k[l + 4 * m];
          255 != n &&
            ((n *= 32897),
            (g[h + 4 * m + 0] = (g[h + 4 * m + 0] * n) >> 23),
            (g[h + 4 * m + 1] = (g[h + 4 * m + 1] * n) >> 23),
            (g[h + 4 * m + 2] = (g[h + 4 * m + 2] * n) >> 23));
        }
        b += f;
      }
    }
    function Jf(a, b, c, d, e) {
      for (; 0 < d--; ) {
        var f;
        for (f = 0; f < c; ++f) {
          var g = a[b + 2 * f + 0],
            h = a[b + 2 * f + 1],
            k = h & 15,
            l = 4369 * k,
            h = (((h & 240) | (h >> 4)) * l) >> 16;
          a[b + 2 * f + 0] =
            (((((g & 240) | (g >> 4)) * l) >> 16) & 240) |
            ((((((g & 15) | (g << 4)) * l) >> 16) >> 4) & 15);
          a[b + 2 * f + 1] = (h & 240) | k;
        }
        b += e;
      }
    }
    function Kf(a, b, c, d, e, f, g, h) {
      var k = 255,
        l,
        m;
      for (m = 0; m < e; ++m) {
        for (l = 0; l < d; ++l) {
          var n = a[b + l];
          f[g + 4 * l] = n;
          k &= n;
        }
        b += c;
        g += h;
      }
      return 255 != k;
    }
    function Lf(a, b, c, d, e) {
      var f;
      for (f = 0; f < e; ++f) c[d + f] = a[b + f] >> 8;
    }
    function Aa() {
      za = If;
      vc = Jf;
      fc = Kf;
      Fc = Lf;
    }
    function va(a, b, c) {
      self[a] = function(a, e, f, g, h, k, l, m, n, r, q, t, v, p, u, w, y) {
        var d,
          E = (y - 1) >> 1;
        var B = h[k + 0] | (l[m + 0] << 16);
        var C = n[r + 0] | (q[t + 0] << 16);
        x(null != a);
        var z = (3 * B + C + 131074) >> 2;
        b(a[e + 0], z & 255, z >> 16, v, p);
        null != f &&
          ((z = (3 * C + B + 131074) >> 2),
          b(f[g + 0], z & 255, z >> 16, u, w));
        for (d = 1; d <= E; ++d) {
          var D = h[k + d] | (l[m + d] << 16);
          var G = n[r + d] | (q[t + d] << 16);
          var F = B + D + C + G + 524296;
          var H = (F + 2 * (D + C)) >> 3;
          F = (F + 2 * (B + G)) >> 3;
          z = (H + B) >> 1;
          B = (F + D) >> 1;
          b(a[e + 2 * d - 1], z & 255, z >> 16, v, p + (2 * d - 1) * c);
          b(a[e + 2 * d - 0], B & 255, B >> 16, v, p + (2 * d - 0) * c);
          null != f &&
            ((z = (F + C) >> 1),
            (B = (H + G) >> 1),
            b(f[g + 2 * d - 1], z & 255, z >> 16, u, w + (2 * d - 1) * c),
            b(f[g + 2 * d + 0], B & 255, B >> 16, u, w + (2 * d + 0) * c));
          B = D;
          C = G;
        }
        y & 1 ||
          ((z = (3 * B + C + 131074) >> 2),
          b(a[e + y - 1], z & 255, z >> 16, v, p + (y - 1) * c),
          null != f &&
            ((z = (3 * C + B + 131074) >> 2),
            b(f[g + y - 1], z & 255, z >> 16, u, w + (y - 1) * c)));
      };
    }
    function ic() {
      P[Ca] = Mf;
      P[Ua] = nd;
      P[tc] = Nf;
      P[Va] = od;
      P[ya] = pd;
      P[Db] = qd;
      P[wc] = Of;
      P[zb] = nd;
      P[Ab] = od;
      P[Ja] = pd;
      P[Bb] = qd;
    }
    function Sb(a) {
      return a & ~Pf ? (0 > a ? 0 : 255) : a >> rd;
    }
    function bb(a, b) {
      return Sb(((19077 * a) >> 8) + ((26149 * b) >> 8) - 14234);
    }
    function nb(a, b, c) {
      return Sb(
        ((19077 * a) >> 8) - ((6419 * b) >> 8) - ((13320 * c) >> 8) + 8708
      );
    }
    function Pa(a, b) {
      return Sb(((19077 * a) >> 8) + ((33050 * b) >> 8) - 17685);
    }
    function Ga(a, b, c, d, e) {
      d[e + 0] = bb(a, c);
      d[e + 1] = nb(a, b, c);
      d[e + 2] = Pa(a, b);
    }
    function Tb(a, b, c, d, e) {
      d[e + 0] = Pa(a, b);
      d[e + 1] = nb(a, b, c);
      d[e + 2] = bb(a, c);
    }
    function sd(a, b, c, d, e) {
      var f = nb(a, b, c);
      b = ((f << 3) & 224) | (Pa(a, b) >> 3);
      d[e + 0] = (bb(a, c) & 248) | (f >> 5);
      d[e + 1] = b;
    }
    function td(a, b, c, d, e) {
      var f = (Pa(a, b) & 240) | 15;
      d[e + 0] = (bb(a, c) & 240) | (nb(a, b, c) >> 4);
      d[e + 1] = f;
    }
    function ud(a, b, c, d, e) {
      d[e + 0] = 255;
      Ga(a, b, c, d, e + 1);
    }
    function vd(a, b, c, d, e) {
      Tb(a, b, c, d, e);
      d[e + 3] = 255;
    }
    function wd(a, b, c, d, e) {
      Ga(a, b, c, d, e);
      d[e + 3] = 255;
    }
    function ga(a, b) {
      return 0 > a ? 0 : a > b ? b : a;
    }
    function la(a, b, c) {
      self[a] = function(a, e, f, g, h, k, l, m, n) {
        for (var d = m + (n & -2) * c; m != d; )
          b(a[e + 0], f[g + 0], h[k + 0], l, m),
            b(a[e + 1], f[g + 0], h[k + 0], l, m + c),
            (e += 2),
            ++g,
            ++k,
            (m += 2 * c);
        n & 1 && b(a[e + 0], f[g + 0], h[k + 0], l, m);
      };
    }
    function xd(a, b, c) {
      return 0 == c ? (0 == a ? (0 == b ? 6 : 5) : 0 == b ? 4 : 0) : c;
    }
    function yd(a, b, c, d, e) {
      switch (a >>> 30) {
        case 3:
          Za(b, c, d, e, 0);
          break;
        case 2:
          fd(b, c, d, e);
          break;
        case 1:
          pa(b, c, d, e);
      }
    }
    function Oc(a, b) {
      var c,
        d,
        e = b.M,
        f = b.Nb,
        g = a.oc,
        h = a.pc + 40,
        k = a.oc,
        l = a.pc + 584,
        m = a.oc,
        n = a.pc + 600;
      for (c = 0; 16 > c; ++c) g[h + 32 * c - 1] = 129;
      for (c = 0; 8 > c; ++c)
        (k[l + 32 * c - 1] = 129), (m[n + 32 * c - 1] = 129);
      0 < e
        ? (g[h - 1 - 32] = k[l - 1 - 32] = m[n - 1 - 32] = 129)
        : (M(g, h - 32 - 1, 127, 21),
          M(k, l - 32 - 1, 127, 9),
          M(m, n - 32 - 1, 127, 9));
      for (d = 0; d < a.za; ++d) {
        var r = b.ya[b.aa + d];
        if (0 < d) {
          for (c = -1; 16 > c; ++c) I(g, h + 32 * c - 4, g, h + 32 * c + 12, 4);
          for (c = -1; 8 > c; ++c)
            I(k, l + 32 * c - 4, k, l + 32 * c + 4, 4),
              I(m, n + 32 * c - 4, m, n + 32 * c + 4, 4);
        }
        var q = a.Gd,
          t = a.Hd + d,
          v = r.ad,
          p = r.Hc;
        0 < e &&
          (I(g, h - 32, q[t].y, 0, 16),
          I(k, l - 32, q[t].f, 0, 8),
          I(m, n - 32, q[t].ea, 0, 8));
        if (r.Za) {
          var u = g;
          var w = h - 32 + 16;
          0 < e &&
            (d >= a.za - 1
              ? M(u, w, q[t].y[15], 4)
              : I(u, w, q[t + 1].y, 0, 4));
          for (c = 0; 4 > c; c++)
            u[w + 128 + c] = u[w + 256 + c] = u[w + 384 + c] = u[w + 0 + c];
          for (c = 0; 16 > c; ++c, p <<= 2)
            (u = g), (w = h + zd[c]), W[r.Ob[c]](u, w), yd(p, v, 16 * +c, u, w);
        } else if (((u = xd(d, e, r.Ob[0])), Y[u](g, h), 0 != p))
          for (c = 0; 16 > c; ++c, p <<= 2) yd(p, v, 16 * +c, g, h + zd[c]);
        c = r.Gc;
        u = xd(d, e, r.Dd);
        ka[u](k, l);
        ka[u](m, n);
        r = c >> 0;
        p = v;
        u = k;
        w = l;
        r & 255 && (r & 170 ? Nb(p, 256, u, w) : Ob(p, 256, u, w));
        c >>= 8;
        r = m;
        p = n;
        c & 255 && (c & 170 ? Nb(v, 320, r, p) : Ob(v, 320, r, p));
        e < a.Ub - 1 &&
          (I(q[t].y, 0, g, h + 480, 16),
          I(q[t].f, 0, k, l + 224, 8),
          I(q[t].ea, 0, m, n + 224, 8));
        c = 8 * f * a.B;
        q = a.sa;
        t = a.ta + 16 * d + 16 * f * a.R;
        v = a.qa;
        r = a.ra + 8 * d + c;
        p = a.Ha;
        u = a.Ia + 8 * d + c;
        for (c = 0; 16 > c; ++c) I(q, t + c * a.R, g, h + 32 * c, 16);
        for (c = 0; 8 > c; ++c)
          I(v, r + c * a.B, k, l + 32 * c, 8),
            I(p, u + c * a.B, m, n + 32 * c, 8);
      }
    }
    function Ad(a, b, c, d, e, f, g, h, k) {
      var l = [0],
        m = [0],
        n = 0,
        r = null != k ? k.kd : 0,
        q = null != k ? k : new md();
      if (null == a || 12 > c) return 7;
      q.data = a;
      q.w = b;
      q.ha = c;
      b = [b];
      c = [c];
      q.gb = [q.gb];
      a: {
        var t = b;
        var v = c;
        var p = q.gb;
        x(null != a);
        x(null != v);
        x(null != p);
        p[0] = 0;
        if (12 <= v[0] && !fa(a, t[0], "RIFF")) {
          if (fa(a, t[0] + 8, "WEBP")) {
            p = 3;
            break a;
          }
          var u = Ha(a, t[0] + 4);
          if (12 > u || 4294967286 < u) {
            p = 3;
            break a;
          }
          if (r && u > v[0] - 8) {
            p = 7;
            break a;
          }
          p[0] = u;
          t[0] += 12;
          v[0] -= 12;
        }
        p = 0;
      }
      if (0 != p) return p;
      u = 0 < q.gb[0];
      for (c = c[0]; ; ) {
        t = [0];
        n = [n];
        a: {
          var w = a;
          v = b;
          p = c;
          var y = n,
            A = l,
            z = m,
            B = t;
          y[0] = 0;
          if (8 > p[0]) p = 7;
          else {
            if (!fa(w, v[0], "VP8X")) {
              if (10 != Ha(w, v[0] + 4)) {
                p = 3;
                break a;
              }
              if (18 > p[0]) {
                p = 7;
                break a;
              }
              var C = Ha(w, v[0] + 8);
              var D = 1 + Yb(w, v[0] + 12);
              w = 1 + Yb(w, v[0] + 15);
              if (2147483648 <= D * w) {
                p = 3;
                break a;
              }
              null != B && (B[0] = C);
              null != A && (A[0] = D);
              null != z && (z[0] = w);
              v[0] += 18;
              p[0] -= 18;
              y[0] = 1;
            }
            p = 0;
          }
        }
        n = n[0];
        t = t[0];
        if (0 != p) return p;
        v = !!(t & 2);
        if (!u && n) return 3;
        null != f && (f[0] = !!(t & 16));
        null != g && (g[0] = v);
        null != h && (h[0] = 0);
        g = l[0];
        t = m[0];
        if (n && v && null == k) {
          p = 0;
          break;
        }
        if (4 > c) {
          p = 7;
          break;
        }
        if ((u && n) || (!u && !n && !fa(a, b[0], "ALPH"))) {
          c = [c];
          q.na = [q.na];
          q.P = [q.P];
          q.Sa = [q.Sa];
          a: {
            C = a;
            p = b;
            u = c;
            var y = q.gb,
              A = q.na,
              z = q.P,
              B = q.Sa;
            D = 22;
            x(null != C);
            x(null != u);
            w = p[0];
            var F = u[0];
            x(null != A);
            x(null != B);
            A[0] = null;
            z[0] = null;
            for (B[0] = 0; ; ) {
              p[0] = w;
              u[0] = F;
              if (8 > F) {
                p = 7;
                break a;
              }
              var G = Ha(C, w + 4);
              if (4294967286 < G) {
                p = 3;
                break a;
              }
              var H = (8 + G + 1) & -2;
              D += H;
              if (0 < y && D > y) {
                p = 3;
                break a;
              }
              if (!fa(C, w, "VP8 ") || !fa(C, w, "VP8L")) {
                p = 0;
                break a;
              }
              if (F[0] < H) {
                p = 7;
                break a;
              }
              fa(C, w, "ALPH") || ((A[0] = C), (z[0] = w + 8), (B[0] = G));
              w += H;
              F -= H;
            }
          }
          c = c[0];
          q.na = q.na[0];
          q.P = q.P[0];
          q.Sa = q.Sa[0];
          if (0 != p) break;
        }
        c = [c];
        q.Ja = [q.Ja];
        q.xa = [q.xa];
        a: if (
          ((y = a),
          (p = b),
          (u = c),
          (A = q.gb[0]),
          (z = q.Ja),
          (B = q.xa),
          (C = p[0]),
          (w = !fa(y, C, "VP8 ")),
          (D = !fa(y, C, "VP8L")),
          x(null != y),
          x(null != u),
          x(null != z),
          x(null != B),
          8 > u[0])
        )
          p = 7;
        else {
          if (w || D) {
            y = Ha(y, C + 4);
            if (12 <= A && y > A - 12) {
              p = 3;
              break a;
            }
            if (r && y > u[0] - 8) {
              p = 7;
              break a;
            }
            z[0] = y;
            p[0] += 8;
            u[0] -= 8;
            B[0] = D;
          } else
            (B[0] = 5 <= u[0] && 47 == y[C + 0] && !(y[C + 4] >> 5)),
              (z[0] = u[0]);
          p = 0;
        }
        c = c[0];
        q.Ja = q.Ja[0];
        q.xa = q.xa[0];
        b = b[0];
        if (0 != p) break;
        if (4294967286 < q.Ja) return 3;
        null == h || v || (h[0] = q.xa ? 2 : 1);
        g = [g];
        t = [t];
        if (q.xa) {
          if (5 > c) {
            p = 7;
            break;
          }
          h = g;
          r = t;
          v = f;
          null == a || 5 > c
            ? (a = 0)
            : 5 <= c && 47 == a[b + 0] && !(a[b + 4] >> 5)
            ? ((u = [0]),
              (y = [0]),
              (A = [0]),
              (z = new Ra()),
              cb(z, a, b, c),
              mc(z, u, y, A)
                ? (null != h && (h[0] = u[0]),
                  null != r && (r[0] = y[0]),
                  null != v && (v[0] = A[0]),
                  (a = 1))
                : (a = 0))
            : (a = 0);
        } else {
          if (10 > c) {
            p = 7;
            break;
          }
          h = t;
          null == a || 10 > c || !Jc(a, b + 3, c - 3)
            ? (a = 0)
            : ((r = a[b + 0] | (a[b + 1] << 8) | (a[b + 2] << 16)),
              (v = ((a[b + 7] << 8) | a[b + 6]) & 16383),
              (a = ((a[b + 9] << 8) | a[b + 8]) & 16383),
              r & 1 ||
              3 < ((r >> 1) & 7) ||
              !((r >> 4) & 1) ||
              r >> 5 >= q.Ja ||
              !v ||
              !a
                ? (a = 0)
                : (g && (g[0] = v), h && (h[0] = a), (a = 1)));
        }
        if (!a) return 3;
        g = g[0];
        t = t[0];
        if (n && (l[0] != g || m[0] != t)) return 3;
        null != k &&
          ((k[0] = q),
          (k.offset = b - k.w),
          x(4294967286 > b - k.w),
          x(k.offset == k.ha - c));
        break;
      }
      return 0 == p || (7 == p && n && null == k)
        ? (null != f && (f[0] |= null != q.na && 0 < q.na.length),
          null != d && (d[0] = g),
          null != e && (e[0] = t),
          0)
        : p;
    }
    function hc(a, b, c) {
      var d = b.width,
        e = b.height,
        f = 0,
        g = 0,
        h = d,
        k = e;
      b.Da = null != a && 0 < a.Da;
      if (
        b.Da &&
        ((h = a.cd),
        (k = a.bd),
        (f = a.v),
        (g = a.j),
        11 > c || ((f &= -2), (g &= -2)),
        0 > f || 0 > g || 0 >= h || 0 >= k || f + h > d || g + k > e)
      )
        return 0;
      b.v = f;
      b.j = g;
      b.va = f + h;
      b.o = g + k;
      b.U = h;
      b.T = k;
      b.da = null != a && 0 < a.da;
      if (b.da) {
        c = [a.ib];
        f = [a.hb];
        if (!bc(h, k, c, f)) return 0;
        b.ib = c[0];
        b.hb = f[0];
      }
      b.ob = null != a && a.ob;
      b.Kb = null == a || !a.Sd;
      b.da && ((b.ob = b.ib < (3 * d) / 4 && b.hb < (3 * e) / 4), (b.Kb = 0));
      return 1;
    }
    function Bd(a) {
      if (null == a) return 2;
      if (11 > a.S) {
        var b = a.f.RGBA;
        b.fb += (a.height - 1) * b.A;
        b.A = -b.A;
      } else
        (b = a.f.kb),
          (a = a.height),
          (b.O += (a - 1) * b.fa),
          (b.fa = -b.fa),
          (b.N += ((a - 1) >> 1) * b.Ab),
          (b.Ab = -b.Ab),
          (b.W += ((a - 1) >> 1) * b.Db),
          (b.Db = -b.Db),
          null != b.F && ((b.J += (a - 1) * b.lb), (b.lb = -b.lb));
      return 0;
    }
    function Cd(a, b, c, d) {
      if (null == d || 0 >= a || 0 >= b) return 2;
      if (null != c) {
        if (c.Da) {
          var e = c.cd,
            f = c.bd,
            g = c.v & -2,
            h = c.j & -2;
          if (0 > g || 0 > h || 0 >= e || 0 >= f || g + e > a || h + f > b)
            return 2;
          a = e;
          b = f;
        }
        if (c.da) {
          e = [c.ib];
          f = [c.hb];
          if (!bc(a, b, e, f)) return 2;
          a = e[0];
          b = f[0];
        }
      }
      d.width = a;
      d.height = b;
      a: {
        var k = d.width;
        var l = d.height;
        a = d.S;
        if (0 >= k || 0 >= l || !(a >= Ca && 13 > a)) a = 2;
        else {
          if (0 >= d.Rd && null == d.sd) {
            var g = (f = e = b = 0),
              h = k * Dd[a],
              m = h * l;
            11 > a ||
              ((b = (k + 1) / 2),
              (f = ((l + 1) / 2) * b),
              12 == a && ((e = k), (g = e * l)));
            l = V(m + 2 * f + g);
            if (null == l) {
              a = 1;
              break a;
            }
            d.sd = l;
            11 > a
              ? ((k = d.f.RGBA),
                (k.eb = l),
                (k.fb = 0),
                (k.A = h),
                (k.size = m))
              : ((k = d.f.kb),
                (k.y = l),
                (k.O = 0),
                (k.fa = h),
                (k.Fd = m),
                (k.f = l),
                (k.N = 0 + m),
                (k.Ab = b),
                (k.Cd = f),
                (k.ea = l),
                (k.W = 0 + m + f),
                (k.Db = b),
                (k.Ed = f),
                12 == a && ((k.F = l), (k.J = 0 + m + 2 * f)),
                (k.Tc = g),
                (k.lb = e));
          }
          b = 1;
          e = d.S;
          f = d.width;
          g = d.height;
          if (e >= Ca && 13 > e)
            if (11 > e)
              (a = d.f.RGBA),
                (h = Math.abs(a.A)),
                (b &= h * (g - 1) + f <= a.size),
                (b &= h >= f * Dd[e]),
                (b &= null != a.eb);
            else {
              a = d.f.kb;
              h = (f + 1) / 2;
              m = (g + 1) / 2;
              k = Math.abs(a.fa);
              var l = Math.abs(a.Ab),
                n = Math.abs(a.Db),
                r = Math.abs(a.lb),
                q = r * (g - 1) + f;
              b &= k * (g - 1) + f <= a.Fd;
              b &= l * (m - 1) + h <= a.Cd;
              b &= n * (m - 1) + h <= a.Ed;
              b = b & (k >= f) & (l >= h) & (n >= h);
              b &= null != a.y;
              b &= null != a.f;
              b &= null != a.ea;
              12 == e && ((b &= r >= f), (b &= q <= a.Tc), (b &= null != a.F));
            }
          else b = 0;
          a = b ? 0 : 2;
        }
      }
      if (0 != a) return a;
      null != c && c.fd && (a = Bd(d));
      return a;
    }
    var xb = 64,
      Hd = [
        0,
        1,
        3,
        7,
        15,
        31,
        63,
        127,
        255,
        511,
        1023,
        2047,
        4095,
        8191,
        16383,
        32767,
        65535,
        131071,
        262143,
        524287,
        1048575,
        2097151,
        4194303,
        8388607,
        16777215
      ],
      Gd = 24,
      ob = 32,
      Xb = 8,
      Id = [
        0,
        0,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7
      ];
    X("Predictor0", "PredictorAdd0");
    self.Predictor0 = function() {
      return 4278190080;
    };
    self.Predictor1 = function(a) {
      return a;
    };
    self.Predictor2 = function(a, b, c) {
      return b[c + 0];
    };
    self.Predictor3 = function(a, b, c) {
      return b[c + 1];
    };
    self.Predictor4 = function(a, b, c) {
      return b[c - 1];
    };
    self.Predictor5 = function(a, b, c) {
      return aa(aa(a, b[c + 1]), b[c + 0]);
    };
    self.Predictor6 = function(a, b, c) {
      return aa(a, b[c - 1]);
    };
    self.Predictor7 = function(a, b, c) {
      return aa(a, b[c + 0]);
    };
    self.Predictor8 = function(a, b, c) {
      return aa(b[c - 1], b[c + 0]);
    };
    self.Predictor9 = function(a, b, c) {
      return aa(b[c + 0], b[c + 1]);
    };
    self.Predictor10 = function(a, b, c) {
      return aa(aa(a, b[c - 1]), aa(b[c + 0], b[c + 1]));
    };
    self.Predictor11 = function(a, b, c) {
      var d = b[c + 0];
      b = b[c - 1];
      return 0 >=
        Ia((d >> 24) & 255, (a >> 24) & 255, (b >> 24) & 255) +
          Ia((d >> 16) & 255, (a >> 16) & 255, (b >> 16) & 255) +
          Ia((d >> 8) & 255, (a >> 8) & 255, (b >> 8) & 255) +
          Ia(d & 255, a & 255, b & 255)
        ? d
        : a;
    };
    self.Predictor12 = function(a, b, c) {
      var d = b[c + 0];
      b = b[c - 1];
      return (
        ((sa(((a >> 24) & 255) + ((d >> 24) & 255) - ((b >> 24) & 255)) << 24) |
          (sa(((a >> 16) & 255) + ((d >> 16) & 255) - ((b >> 16) & 255)) <<
            16) |
          (sa(((a >> 8) & 255) + ((d >> 8) & 255) - ((b >> 8) & 255)) << 8) |
          sa((a & 255) + (d & 255) - (b & 255))) >>>
        0
      );
    };
    self.Predictor13 = function(a, b, c) {
      var d = b[c - 1];
      a = aa(a, b[c + 0]);
      return (
        ((eb((a >> 24) & 255, (d >> 24) & 255) << 24) |
          (eb((a >> 16) & 255, (d >> 16) & 255) << 16) |
          (eb((a >> 8) & 255, (d >> 8) & 255) << 8) |
          eb((a >> 0) & 255, (d >> 0) & 255)) >>>
        0
      );
    };
    var ee = self.PredictorAdd0;
    self.PredictorAdd1 = cc;
    X("Predictor2", "PredictorAdd2");
    X("Predictor3", "PredictorAdd3");
    X("Predictor4", "PredictorAdd4");
    X("Predictor5", "PredictorAdd5");
    X("Predictor6", "PredictorAdd6");
    X("Predictor7", "PredictorAdd7");
    X("Predictor8", "PredictorAdd8");
    X("Predictor9", "PredictorAdd9");
    X("Predictor10", "PredictorAdd10");
    X("Predictor11", "PredictorAdd11");
    X("Predictor12", "PredictorAdd12");
    X("Predictor13", "PredictorAdd13");
    var fe = self.PredictorAdd2;
    ec(
      "ColorIndexInverseTransform",
      "MapARGB",
      "32b",
      function(a) {
        return (a >> 8) & 255;
      },
      function(a) {
        return a;
      }
    );
    ec(
      "VP8LColorIndexInverseTransformAlpha",
      "MapAlpha",
      "8b",
      function(a) {
        return a;
      },
      function(a) {
        return (a >> 8) & 255;
      }
    );
    var rc = self.ColorIndexInverseTransform,
      ke = self.MapARGB,
      he = self.VP8LColorIndexInverseTransformAlpha,
      le = self.MapAlpha,
      pc,
      qc = (self.VP8LPredictorsAdd = []);
    qc.length = 16;
    (self.VP8LPredictors = []).length = 16;
    (self.VP8LPredictorsAdd_C = []).length = 16;
    (self.VP8LPredictors_C = []).length = 16;
    var Fb,
      sc,
      Gb,
      Hb,
      xc,
      uc,
      bd = V(511),
      cd = V(2041),
      dd = V(225),
      ed = V(767),
      ad = 0,
      Qb = cd,
      mb = dd,
      R = ed,
      U = bd,
      Ca = 0,
      Ua = 1,
      tc = 2,
      Va = 3,
      ya = 4,
      Db = 5,
      wc = 6,
      zb = 7,
      Ab = 8,
      Ja = 9,
      Bb = 10,
      pe = [2, 3, 7],
      oe = [3, 3, 11],
      Dc = [280, 256, 256, 256, 40],
      qe = [0, 1, 1, 1, 0],
      ne = [17, 18, 0, 1, 2, 3, 4, 5, 16, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      de = [
        24,
        7,
        23,
        25,
        40,
        6,
        39,
        41,
        22,
        26,
        38,
        42,
        56,
        5,
        55,
        57,
        21,
        27,
        54,
        58,
        37,
        43,
        72,
        4,
        71,
        73,
        20,
        28,
        53,
        59,
        70,
        74,
        36,
        44,
        88,
        69,
        75,
        52,
        60,
        3,
        87,
        89,
        19,
        29,
        86,
        90,
        35,
        45,
        68,
        76,
        85,
        91,
        51,
        61,
        104,
        2,
        103,
        105,
        18,
        30,
        102,
        106,
        34,
        46,
        84,
        92,
        67,
        77,
        101,
        107,
        50,
        62,
        120,
        1,
        119,
        121,
        83,
        93,
        17,
        31,
        100,
        108,
        66,
        78,
        118,
        122,
        33,
        47,
        117,
        123,
        49,
        63,
        99,
        109,
        82,
        94,
        0,
        116,
        124,
        65,
        79,
        16,
        32,
        98,
        110,
        48,
        115,
        125,
        81,
        95,
        64,
        114,
        126,
        97,
        111,
        80,
        113,
        127,
        96,
        112
      ],
      me = [
        2954,
        2956,
        2958,
        2962,
        2970,
        2986,
        3018,
        3082,
        3212,
        3468,
        3980,
        5004
      ],
      ie = 8,
      Lb = [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        17,
        18,
        19,
        20,
        20,
        21,
        21,
        22,
        22,
        23,
        23,
        24,
        25,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        91,
        93,
        95,
        96,
        98,
        100,
        101,
        102,
        104,
        106,
        108,
        110,
        112,
        114,
        116,
        118,
        122,
        124,
        126,
        128,
        130,
        132,
        134,
        136,
        138,
        140,
        143,
        145,
        148,
        151,
        154,
        157
      ],
      Mb = [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        60,
        62,
        64,
        66,
        68,
        70,
        72,
        74,
        76,
        78,
        80,
        82,
        84,
        86,
        88,
        90,
        92,
        94,
        96,
        98,
        100,
        102,
        104,
        106,
        108,
        110,
        112,
        114,
        116,
        119,
        122,
        125,
        128,
        131,
        134,
        137,
        140,
        143,
        146,
        149,
        152,
        155,
        158,
        161,
        164,
        167,
        170,
        173,
        177,
        181,
        185,
        189,
        193,
        197,
        201,
        205,
        209,
        213,
        217,
        221,
        225,
        229,
        234,
        239,
        245,
        249,
        254,
        259,
        264,
        269,
        274,
        279,
        284
      ],
      oa = null,
      He = [
        [173, 148, 140, 0],
        [176, 155, 140, 135, 0],
        [180, 157, 141, 134, 130, 0],
        [254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 0]
      ],
      Ie = [0, 1, 4, 8, 5, 2, 3, 6, 9, 12, 13, 10, 7, 11, 14, 15],
      Mc = [-0, 1, -1, 2, -2, 3, 4, 6, -3, 5, -4, -5, -6, 7, -7, 8, -8, -9],
      Fe = [
        [
          [
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [253, 136, 254, 255, 228, 219, 128, 128, 128, 128, 128],
            [189, 129, 242, 255, 227, 213, 255, 219, 128, 128, 128],
            [106, 126, 227, 252, 214, 209, 255, 255, 128, 128, 128]
          ],
          [
            [1, 98, 248, 255, 236, 226, 255, 255, 128, 128, 128],
            [181, 133, 238, 254, 221, 234, 255, 154, 128, 128, 128],
            [78, 134, 202, 247, 198, 180, 255, 219, 128, 128, 128]
          ],
          [
            [1, 185, 249, 255, 243, 255, 128, 128, 128, 128, 128],
            [184, 150, 247, 255, 236, 224, 128, 128, 128, 128, 128],
            [77, 110, 216, 255, 236, 230, 128, 128, 128, 128, 128]
          ],
          [
            [1, 101, 251, 255, 241, 255, 128, 128, 128, 128, 128],
            [170, 139, 241, 252, 236, 209, 255, 255, 128, 128, 128],
            [37, 116, 196, 243, 228, 255, 255, 255, 128, 128, 128]
          ],
          [
            [1, 204, 254, 255, 245, 255, 128, 128, 128, 128, 128],
            [207, 160, 250, 255, 238, 128, 128, 128, 128, 128, 128],
            [102, 103, 231, 255, 211, 171, 128, 128, 128, 128, 128]
          ],
          [
            [1, 152, 252, 255, 240, 255, 128, 128, 128, 128, 128],
            [177, 135, 243, 255, 234, 225, 128, 128, 128, 128, 128],
            [80, 129, 211, 255, 194, 224, 128, 128, 128, 128, 128]
          ],
          [
            [1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [246, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [255, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]
          ]
        ],
        [
          [
            [198, 35, 237, 223, 193, 187, 162, 160, 145, 155, 62],
            [131, 45, 198, 221, 172, 176, 220, 157, 252, 221, 1],
            [68, 47, 146, 208, 149, 167, 221, 162, 255, 223, 128]
          ],
          [
            [1, 149, 241, 255, 221, 224, 255, 255, 128, 128, 128],
            [184, 141, 234, 253, 222, 220, 255, 199, 128, 128, 128],
            [81, 99, 181, 242, 176, 190, 249, 202, 255, 255, 128]
          ],
          [
            [1, 129, 232, 253, 214, 197, 242, 196, 255, 255, 128],
            [99, 121, 210, 250, 201, 198, 255, 202, 128, 128, 128],
            [23, 91, 163, 242, 170, 187, 247, 210, 255, 255, 128]
          ],
          [
            [1, 200, 246, 255, 234, 255, 128, 128, 128, 128, 128],
            [109, 178, 241, 255, 231, 245, 255, 255, 128, 128, 128],
            [44, 130, 201, 253, 205, 192, 255, 255, 128, 128, 128]
          ],
          [
            [1, 132, 239, 251, 219, 209, 255, 165, 128, 128, 128],
            [94, 136, 225, 251, 218, 190, 255, 255, 128, 128, 128],
            [22, 100, 174, 245, 186, 161, 255, 199, 128, 128, 128]
          ],
          [
            [1, 182, 249, 255, 232, 235, 128, 128, 128, 128, 128],
            [124, 143, 241, 255, 227, 234, 128, 128, 128, 128, 128],
            [35, 77, 181, 251, 193, 211, 255, 205, 128, 128, 128]
          ],
          [
            [1, 157, 247, 255, 236, 231, 255, 255, 128, 128, 128],
            [121, 141, 235, 255, 225, 227, 255, 255, 128, 128, 128],
            [45, 99, 188, 251, 195, 217, 255, 224, 128, 128, 128]
          ],
          [
            [1, 1, 251, 255, 213, 255, 128, 128, 128, 128, 128],
            [203, 1, 248, 255, 255, 128, 128, 128, 128, 128, 128],
            [137, 1, 177, 255, 224, 255, 128, 128, 128, 128, 128]
          ]
        ],
        [
          [
            [253, 9, 248, 251, 207, 208, 255, 192, 128, 128, 128],
            [175, 13, 224, 243, 193, 185, 249, 198, 255, 255, 128],
            [73, 17, 171, 221, 161, 179, 236, 167, 255, 234, 128]
          ],
          [
            [1, 95, 247, 253, 212, 183, 255, 255, 128, 128, 128],
            [239, 90, 244, 250, 211, 209, 255, 255, 128, 128, 128],
            [155, 77, 195, 248, 188, 195, 255, 255, 128, 128, 128]
          ],
          [
            [1, 24, 239, 251, 218, 219, 255, 205, 128, 128, 128],
            [201, 51, 219, 255, 196, 186, 128, 128, 128, 128, 128],
            [69, 46, 190, 239, 201, 218, 255, 228, 128, 128, 128]
          ],
          [
            [1, 191, 251, 255, 255, 128, 128, 128, 128, 128, 128],
            [223, 165, 249, 255, 213, 255, 128, 128, 128, 128, 128],
            [141, 124, 248, 255, 255, 128, 128, 128, 128, 128, 128]
          ],
          [
            [1, 16, 248, 255, 255, 128, 128, 128, 128, 128, 128],
            [190, 36, 230, 255, 236, 255, 128, 128, 128, 128, 128],
            [149, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [1, 226, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [247, 192, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [240, 128, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [1, 134, 252, 255, 255, 128, 128, 128, 128, 128, 128],
            [213, 62, 250, 255, 255, 128, 128, 128, 128, 128, 128],
            [55, 93, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]
          ]
        ],
        [
          [
            [202, 24, 213, 235, 186, 191, 220, 160, 240, 175, 255],
            [126, 38, 182, 232, 169, 184, 228, 174, 255, 187, 128],
            [61, 46, 138, 219, 151, 178, 240, 170, 255, 216, 128]
          ],
          [
            [1, 112, 230, 250, 199, 191, 247, 159, 255, 255, 128],
            [166, 109, 228, 252, 211, 215, 255, 174, 128, 128, 128],
            [39, 77, 162, 232, 172, 180, 245, 178, 255, 255, 128]
          ],
          [
            [1, 52, 220, 246, 198, 199, 249, 220, 255, 255, 128],
            [124, 74, 191, 243, 183, 193, 250, 221, 255, 255, 128],
            [24, 71, 130, 219, 154, 170, 243, 182, 255, 255, 128]
          ],
          [
            [1, 182, 225, 249, 219, 240, 255, 224, 128, 128, 128],
            [149, 150, 226, 252, 216, 205, 255, 171, 128, 128, 128],
            [28, 108, 170, 242, 183, 194, 254, 223, 255, 255, 128]
          ],
          [
            [1, 81, 230, 252, 204, 203, 255, 192, 128, 128, 128],
            [123, 102, 209, 247, 188, 196, 255, 233, 128, 128, 128],
            [20, 95, 153, 243, 164, 173, 255, 203, 128, 128, 128]
          ],
          [
            [1, 222, 248, 255, 216, 213, 128, 128, 128, 128, 128],
            [168, 175, 246, 252, 235, 205, 255, 255, 128, 128, 128],
            [47, 116, 215, 255, 211, 212, 255, 255, 128, 128, 128]
          ],
          [
            [1, 121, 236, 253, 212, 214, 255, 255, 128, 128, 128],
            [141, 84, 213, 252, 201, 202, 255, 219, 128, 128, 128],
            [42, 80, 160, 240, 162, 185, 255, 205, 128, 128, 128]
          ],
          [
            [1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [244, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [238, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ]
        ]
      ],
      Ke = [
        [
          [231, 120, 48, 89, 115, 113, 120, 152, 112],
          [152, 179, 64, 126, 170, 118, 46, 70, 95],
          [175, 69, 143, 80, 85, 82, 72, 155, 103],
          [56, 58, 10, 171, 218, 189, 17, 13, 152],
          [114, 26, 17, 163, 44, 195, 21, 10, 173],
          [121, 24, 80, 195, 26, 62, 44, 64, 85],
          [144, 71, 10, 38, 171, 213, 144, 34, 26],
          [170, 46, 55, 19, 136, 160, 33, 206, 71],
          [63, 20, 8, 114, 114, 208, 12, 9, 226],
          [81, 40, 11, 96, 182, 84, 29, 16, 36]
        ],
        [
          [134, 183, 89, 137, 98, 101, 106, 165, 148],
          [72, 187, 100, 130, 157, 111, 32, 75, 80],
          [66, 102, 167, 99, 74, 62, 40, 234, 128],
          [41, 53, 9, 178, 241, 141, 26, 8, 107],
          [74, 43, 26, 146, 73, 166, 49, 23, 157],
          [65, 38, 105, 160, 51, 52, 31, 115, 128],
          [104, 79, 12, 27, 217, 255, 87, 17, 7],
          [87, 68, 71, 44, 114, 51, 15, 186, 23],
          [47, 41, 14, 110, 182, 183, 21, 17, 194],
          [66, 45, 25, 102, 197, 189, 23, 18, 22]
        ],
        [
          [88, 88, 147, 150, 42, 46, 45, 196, 205],
          [43, 97, 183, 117, 85, 38, 35, 179, 61],
          [39, 53, 200, 87, 26, 21, 43, 232, 171],
          [56, 34, 51, 104, 114, 102, 29, 93, 77],
          [39, 28, 85, 171, 58, 165, 90, 98, 64],
          [34, 22, 116, 206, 23, 34, 43, 166, 73],
          [107, 54, 32, 26, 51, 1, 81, 43, 31],
          [68, 25, 106, 22, 64, 171, 36, 225, 114],
          [34, 19, 21, 102, 132, 188, 16, 76, 124],
          [62, 18, 78, 95, 85, 57, 50, 48, 51]
        ],
        [
          [193, 101, 35, 159, 215, 111, 89, 46, 111],
          [60, 148, 31, 172, 219, 228, 21, 18, 111],
          [112, 113, 77, 85, 179, 255, 38, 120, 114],
          [40, 42, 1, 196, 245, 209, 10, 25, 109],
          [88, 43, 29, 140, 166, 213, 37, 43, 154],
          [61, 63, 30, 155, 67, 45, 68, 1, 209],
          [100, 80, 8, 43, 154, 1, 51, 26, 71],
          [142, 78, 78, 16, 255, 128, 34, 197, 171],
          [41, 40, 5, 102, 211, 183, 4, 1, 221],
          [51, 50, 17, 168, 209, 192, 23, 25, 82]
        ],
        [
          [138, 31, 36, 171, 27, 166, 38, 44, 229],
          [67, 87, 58, 169, 82, 115, 26, 59, 179],
          [63, 59, 90, 180, 59, 166, 93, 73, 154],
          [40, 40, 21, 116, 143, 209, 34, 39, 175],
          [47, 15, 16, 183, 34, 223, 49, 45, 183],
          [46, 17, 33, 183, 6, 98, 15, 32, 183],
          [57, 46, 22, 24, 128, 1, 54, 17, 37],
          [65, 32, 73, 115, 28, 128, 23, 128, 205],
          [40, 3, 9, 115, 51, 192, 18, 6, 223],
          [87, 37, 9, 115, 59, 77, 64, 21, 47]
        ],
        [
          [104, 55, 44, 218, 9, 54, 53, 130, 226],
          [64, 90, 70, 205, 40, 41, 23, 26, 57],
          [54, 57, 112, 184, 5, 41, 38, 166, 213],
          [30, 34, 26, 133, 152, 116, 10, 32, 134],
          [39, 19, 53, 221, 26, 114, 32, 73, 255],
          [31, 9, 65, 234, 2, 15, 1, 118, 73],
          [75, 32, 12, 51, 192, 255, 160, 43, 51],
          [88, 31, 35, 67, 102, 85, 55, 186, 85],
          [56, 21, 23, 111, 59, 205, 45, 37, 192],
          [55, 38, 70, 124, 73, 102, 1, 34, 98]
        ],
        [
          [125, 98, 42, 88, 104, 85, 117, 175, 82],
          [95, 84, 53, 89, 128, 100, 113, 101, 45],
          [75, 79, 123, 47, 51, 128, 81, 171, 1],
          [57, 17, 5, 71, 102, 57, 53, 41, 49],
          [38, 33, 13, 121, 57, 73, 26, 1, 85],
          [41, 10, 67, 138, 77, 110, 90, 47, 114],
          [115, 21, 2, 10, 102, 255, 166, 23, 6],
          [101, 29, 16, 10, 85, 128, 101, 196, 26],
          [57, 18, 10, 102, 102, 213, 34, 20, 43],
          [117, 20, 15, 36, 163, 128, 68, 1, 26]
        ],
        [
          [102, 61, 71, 37, 34, 53, 31, 243, 192],
          [69, 60, 71, 38, 73, 119, 28, 222, 37],
          [68, 45, 128, 34, 1, 47, 11, 245, 171],
          [62, 17, 19, 70, 146, 85, 55, 62, 70],
          [37, 43, 37, 154, 100, 163, 85, 160, 1],
          [63, 9, 92, 136, 28, 64, 32, 201, 85],
          [75, 15, 9, 9, 64, 255, 184, 119, 16],
          [86, 6, 28, 5, 64, 255, 25, 248, 1],
          [56, 8, 17, 132, 137, 255, 55, 116, 128],
          [58, 15, 20, 82, 135, 57, 26, 121, 40]
        ],
        [
          [164, 50, 31, 137, 154, 133, 25, 35, 218],
          [51, 103, 44, 131, 131, 123, 31, 6, 158],
          [86, 40, 64, 135, 148, 224, 45, 183, 128],
          [22, 26, 17, 131, 240, 154, 14, 1, 209],
          [45, 16, 21, 91, 64, 222, 7, 1, 197],
          [56, 21, 39, 155, 60, 138, 23, 102, 213],
          [83, 12, 13, 54, 192, 255, 68, 47, 28],
          [85, 26, 85, 85, 128, 128, 32, 146, 171],
          [18, 11, 7, 63, 144, 171, 4, 4, 246],
          [35, 27, 10, 146, 174, 171, 12, 26, 128]
        ],
        [
          [190, 80, 35, 99, 180, 80, 126, 54, 45],
          [85, 126, 47, 87, 176, 51, 41, 20, 32],
          [101, 75, 128, 139, 118, 146, 116, 128, 85],
          [56, 41, 15, 176, 236, 85, 37, 9, 62],
          [71, 30, 17, 119, 118, 255, 17, 18, 138],
          [101, 38, 60, 138, 55, 70, 43, 26, 142],
          [146, 36, 19, 30, 171, 255, 97, 27, 20],
          [138, 45, 61, 62, 219, 1, 81, 188, 64],
          [32, 41, 20, 117, 151, 142, 20, 21, 163],
          [112, 19, 12, 61, 195, 128, 48, 4, 24]
        ]
      ],
      Ee = [
        [
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [176, 246, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [223, 241, 252, 255, 255, 255, 255, 255, 255, 255, 255],
            [249, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 244, 252, 255, 255, 255, 255, 255, 255, 255, 255],
            [234, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 246, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [239, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [251, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [251, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 253, 255, 254, 255, 255, 255, 255, 255, 255],
            [250, 255, 254, 255, 254, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ],
        [
          [
            [217, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [225, 252, 241, 253, 255, 255, 254, 255, 255, 255, 255],
            [234, 250, 241, 250, 253, 255, 253, 254, 255, 255, 255]
          ],
          [
            [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [223, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [238, 253, 254, 254, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [249, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [247, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [252, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ],
        [
          [
            [186, 251, 250, 255, 255, 255, 255, 255, 255, 255, 255],
            [234, 251, 244, 254, 255, 255, 255, 255, 255, 255, 255],
            [251, 251, 243, 253, 254, 255, 254, 255, 255, 255, 255]
          ],
          [
            [255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [236, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [251, 253, 253, 254, 254, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ],
        [
          [
            [248, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [250, 254, 252, 254, 255, 255, 255, 255, 255, 255, 255],
            [248, 254, 249, 253, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [246, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [252, 254, 251, 254, 254, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 252, 255, 255, 255, 255, 255, 255, 255, 255],
            [248, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 255, 254, 254, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [245, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 251, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [252, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 252, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [249, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ]
      ],
      Ge = [0, 1, 2, 3, 6, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0],
      Nc,
      Y = [],
      W = [],
      ka = [],
      Za,
      fd,
      Nb,
      pa,
      Ob,
      Xc,
      Tc,
      Yc,
      Uc,
      Zc,
      Vc,
      $c,
      Wc,
      Rc,
      Pc,
      Sc,
      Qc,
      re = 1,
      Cc = 2,
      ia = [],
      za,
      vc,
      fc,
      Fc,
      P = [];
    va("UpsampleRgbLinePair", Ga, 3);
    va("UpsampleBgrLinePair", Tb, 3);
    va("UpsampleRgbaLinePair", wd, 4);
    va("UpsampleBgraLinePair", vd, 4);
    va("UpsampleArgbLinePair", ud, 4);
    va("UpsampleRgba4444LinePair", td, 2);
    va("UpsampleRgb565LinePair", sd, 2);
    var Mf = self.UpsampleRgbLinePair,
      Nf = self.UpsampleBgrLinePair,
      nd = self.UpsampleRgbaLinePair,
      od = self.UpsampleBgraLinePair,
      pd = self.UpsampleArgbLinePair,
      qd = self.UpsampleRgba4444LinePair,
      Of = self.UpsampleRgb565LinePair,
      Wa = 16,
      Ba = 1 << (Wa - 1),
      ta = -227,
      Eb = 482,
      rd = 6,
      Pf = (256 << rd) - 1,
      jc = 0,
      Yd = V(256),
      ae = V(256),
      $d = V(256),
      Zd = V(256),
      be = V(Eb - ta),
      ce = V(Eb - ta);
    la("YuvToRgbRow", Ga, 3);
    la("YuvToBgrRow", Tb, 3);
    la("YuvToRgbaRow", wd, 4);
    la("YuvToBgraRow", vd, 4);
    la("YuvToArgbRow", ud, 4);
    la("YuvToRgba4444Row", td, 2);
    la("YuvToRgb565Row", sd, 2);
    var zd = [
        0,
        4,
        8,
        12,
        128,
        132,
        136,
        140,
        256,
        260,
        264,
        268,
        384,
        388,
        392,
        396
      ],
      Ya = [0, 2, 8],
      Qf = [8, 7, 6, 4, 4, 2, 2, 2, 1, 1, 1, 1],
      Ne = 1;
    this.WebPDecodeRGBA = function(a, b, c, d, e) {
      var f = Ua;
      var g = new Cf(),
        h = new Cb();
      g.ba = h;
      h.S = f;
      h.width = [h.width];
      h.height = [h.height];
      var k = h.width;
      var l = h.height,
        m = new Td();
      if (null == m || null == a) var n = 2;
      else
        x(null != m),
          (n = Ad(a, b, c, m.width, m.height, m.Pd, m.Qd, m.format, null));
      0 != n
        ? (k = 0)
        : (null != k && (k[0] = m.width[0]),
          null != l && (l[0] = m.height[0]),
          (k = 1));
      if (k) {
        h.width = h.width[0];
        h.height = h.height[0];
        null != d && (d[0] = h.width);
        null != e && (e[0] = h.height);
        b: {
          d = new Oa();
          e = new md();
          e.data = a;
          e.w = b;
          e.ha = c;
          e.kd = 1;
          b = [0];
          x(null != e);
          a = Ad(e.data, e.w, e.ha, null, null, null, b, null, e);
          (0 == a || 7 == a) && b[0] && (a = 4);
          b = a;
          if (0 == b) {
            x(null != g);
            d.data = e.data;
            d.w = e.w + e.offset;
            d.ha = e.ha - e.offset;
            d.put = kc;
            d.ac = gc;
            d.bc = lc;
            d.ma = g;
            if (e.xa) {
              a = Bc();
              if (null == a) {
                g = 1;
                break b;
              }
              if (te(a, d)) {
                b = Cd(d.width, d.height, g.Oa, g.ba);
                if ((d = 0 == b)) {
                  c: {
                    d = a;
                    d: for (;;) {
                      if (null == d) {
                        d = 0;
                        break c;
                      }
                      x(null != d.s.yc);
                      x(null != d.s.Ya);
                      x(0 < d.s.Wb);
                      c = d.l;
                      x(null != c);
                      e = c.ma;
                      x(null != e);
                      if (0 != d.xb) {
                        d.ca = e.ba;
                        d.tb = e.tb;
                        x(null != d.ca);
                        if (!hc(e.Oa, c, Va)) {
                          d.a = 2;
                          break d;
                        }
                        if (!Ec(d, c.width)) break d;
                        if (c.da) break d;
                        (c.da || hb(d.ca.S)) && Aa();
                        11 > d.ca.S ||
                          (alert("todo:WebPInitConvertARGBToYUV"),
                          null != d.ca.f.kb.F && Aa());
                        if (
                          d.Pb &&
                          0 < d.s.ua &&
                          null == d.s.vb.X &&
                          !Zb(d.s.vb, d.s.Wa.Xa)
                        ) {
                          d.a = 1;
                          break d;
                        }
                        d.xb = 0;
                      }
                      if (!Jb(d, d.V, d.Ba, d.c, d.i, c.o, ge)) break d;
                      e.Dc = d.Ma;
                      d = 1;
                      break c;
                    }
                    x(0 != d.a);
                    d = 0;
                  }
                  d = !d;
                }
                d && (b = a.a);
              } else b = a.a;
            } else {
              a = new Ce();
              if (null == a) {
                g = 1;
                break b;
              }
              a.Fa = e.na;
              a.P = e.P;
              a.qc = e.Sa;
              if (Kc(a, d)) {
                if (((b = Cd(d.width, d.height, g.Oa, g.ba)), 0 == b)) {
                  a.Aa = 0;
                  c = g.Oa;
                  e = a;
                  x(null != e);
                  if (null != c) {
                    k = c.Md;
                    k = 0 > k ? 0 : 100 < k ? 255 : (255 * k) / 100;
                    if (0 < k) {
                      for (l = m = 0; 4 > l; ++l)
                        (n = e.pb[l]),
                          12 > n.lc &&
                            (n.ia = (k * Qf[0 > n.lc ? 0 : n.lc]) >> 3),
                          (m |= n.ia);
                      m && (alert("todo:VP8InitRandom"), (e.ia = 1));
                    }
                    e.Ga = c.Id;
                    100 < e.Ga ? (e.Ga = 100) : 0 > e.Ga && (e.Ga = 0);
                  }
                  Me(a, d) || (b = a.a);
                }
              } else b = a.a;
            }
            0 == b && null != g.Oa && g.Oa.fd && (b = Bd(g.ba));
          }
          g = b;
        }
        f = 0 != g ? null : 11 > f ? h.f.RGBA.eb : h.f.kb.y;
      } else f = null;
      return f;
    };
    var Dd = [3, 4, 3, 4, 4, 2, 2, 4, 4, 4, 2, 1, 1];
  };
  new WebPDecoder();

  /*Copyright (c) 2017 Dominik Homberger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://webpjs.appspot.com
WebPRiffParser dominikhlbg@gmail.com
*/

  function memcmp(data, data_off, str, size) {
    for (var i = 0; i < size; i++)
      if (data[data_off + i] != str.charCodeAt(i)) return true;
    return false;
  }

  function GetTag(data, data_off) {
    var str = "";
    for (var i = 0; i < 4; i++) str += String.fromCharCode(data[data_off++]);
    return str;
  }

  function GetLE16(data, data_off) {
    return (data[data_off + 0] << 0) | (data[data_off + 1] << 8);
  }

  function GetLE24(data, data_off) {
    return (
      ((data[data_off + 0] << 0) |
        (data[data_off + 1] << 8) |
        (data[data_off + 2] << 16)) >>>
      0
    );
  }

  function GetLE32(data, data_off) {
    return (
      ((data[data_off + 0] << 0) |
        (data[data_off + 1] << 8) |
        (data[data_off + 2] << 16) |
        (data[data_off + 3] << 24)) >>>
      0
    );
  }

  function WebPRiffParser(src, src_off) {
    var imagearray = {};
    var i = 0;
    var alpha_chunk = false;
    var alpha_size = 0;
    var alpha_offset = 0;
    imagearray["frames"] = [];
    if (memcmp(src, src_off, "RIFF", 4)) return;
    src_off += 4;
    var riff_size = GetLE32(src, src_off) + 8;
    src_off += 8;

    while (src_off < src.length) {
      var fourcc = GetTag(src, src_off);
      src_off += 4;

      var payload_size = GetLE32(src, src_off);
      src_off += 4;
      var payload_size_padded = payload_size + (payload_size & 1);

      switch (fourcc) {
        case "VP8 ":
        case "VP8L":
          if (typeof imagearray["frames"][i] === "undefined")
            imagearray["frames"][i] = {};
          var obj = imagearray["frames"][i];
          var height = [0];
          var width = [0];
          obj["src_off"] = alpha_chunk ? alpha_offset : src_off - 8;
          obj["src_size"] = alpha_size + payload_size + 8;
          //var rgba = webpdecoder.WebPDecodeRGBA(src,(alpha_chunk?alpha_offset:src_off-8),alpha_size+payload_size+8,width,height);
          //imagearray[i]={'rgba':rgba,'width':width[0],'height':height[0]};
          i++;
          if (alpha_chunk) {
            alpha_chunk = false;
            alpha_size = 0;
            alpha_offset = 0;
          }
          break;
        case "VP8X":
          var obj = (imagearray["header"] = {});
          var feature_flags = (obj["feature_flags"] = src[src_off]);
          var src_off_ = src_off + 4;
          var canvas_width = (obj["canvas_width"] = 1 + GetLE24(src, src_off_));
          src_off_ += 3;
          var canvas_height = (obj["canvas_height"] =
            1 + GetLE24(src, src_off_));
          src_off_ += 3;
          break;
        case "ALPH":
          alpha_chunk = true;
          alpha_size = payload_size_padded + 8;
          alpha_offset = src_off - 8;
          break;

        case "ANIM":
          var obj = imagearray["header"];
          var bgcolor = (obj["bgcolor"] = GetLE32(src, src_off));
          src_off_ = src_off + 4;

          var loop_count = (obj["loop_count"] = GetLE16(src, src_off_));
          src_off_ += 2;
          break;
        case "ANMF":
          var offset_x = 0,
            offset_y = 0,
            width = 0,
            height = 0,
            duration = 0,
            blend = 0,
            dispose = 0,
            temp = 0;
          var obj = (imagearray["frames"][i] = {});
          obj["offset_x"] = offset_x = 2 * GetLE24(src, src_off);
          src_off += 3;
          obj["offset_y"] = offset_y = 2 * GetLE24(src, src_off);
          src_off += 3;
          obj["width"] = width = 1 + GetLE24(src, src_off);
          src_off += 3;
          obj["height"] = height = 1 + GetLE24(src, src_off);
          src_off += 3;
          obj["duration"] = duration = GetLE24(src, src_off);
          src_off += 3;
          temp = src[src_off++];
          obj["dispose"] = dispose = temp & 1;
          obj["blend"] = blend = (temp >> 1) & 1;
          break;
        default:
      }
      if (fourcc != "ANMF") src_off += payload_size_padded;
    }
    return imagearray;
  }

  var height = [0];
  var width = [0];
  var pixels = [];
  var webpdecoder = new WebPDecoder();

  var response = imageData;
  var imagearray = WebPRiffParser(response, 0);
  imagearray["response"] = response;
  imagearray["rgbaoutput"] = true;
  imagearray["dataurl"] = false;

  var header = imagearray["header"] ? imagearray["header"] : null;
  var frames = imagearray["frames"] ? imagearray["frames"] : null;

  if (header) {
    header["loop_counter"] = header["loop_count"];
    height = [header["canvas_height"]];
    width = [header["canvas_width"]];

    var blend = false;
    for (var f = 0; f < frames.length; f++)
      if (frames[f]["blend"] == 0) {
        blend = true;
        break;
      }
  }

  var frame = frames[0];
  var rgba = webpdecoder.WebPDecodeRGBA(
    response,
    frame["src_off"],
    frame["src_size"],
    width,
    height
  );
  frame["rgba"] = rgba;
  frame["imgwidth"] = width[0];
  frame["imgheight"] = height[0];

  for (var i = 0; i < width[0] * height[0] * 4; i++) {
    pixels[i] = rgba[i];
  }

  this.width = width;
  this.height = height;
  this.data = pixels;
  return this;
}

WebPDecoder.prototype.getData = function() {
  return this.data;
};

try {
  exports.WebPDecoder = WebPDecoder;
} catch (e) {} // CommonJS.
