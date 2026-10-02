import {
  _ as b,
  u as I,
  a as D,
  b as A,
  k as C,
  l as P,
  m as u,
  w as L,
  c as T,
  d as q,
  e as B,
  f as H,
  g as $,
  h as S,
  j as a,
  i as d,
  p as v,
  q as E,
  n as M,
  R as N,
  r as O,
  s as R,
  o as p,
  t as V,
  v as j,
  x as z,
  y as F,
} from "./entry.Bx2--lWY.js";
import { _ as Q } from "./PageDownloadButton.9a7kkcah.js";
import { u as U, _ as W } from "./useSanityData.w2vamrsi.js";
import { p as X, g as G } from "./page.CMhre93t.js";
const J = (o) => (j("data-v-4fe76a0f"), (o = o()), z(), o),
  K = { key: 0, class: "Page-stickers" },
  Y = J(() => F("div", { class: "HomeHero-posTitleHelper" }, null, -1)),
  Z = {
    __name: "[uid]",
    async setup(o) {
      var g;
      let n, _;
      const { locale: l } = I(),
        c = D(),
        h = A(),
        { mobileOrTablet: m, desktop: x } = C();
      P(() => {
        if (e.value._type === "pageDownload") {
          const t = e.value.slices.findIndex((s) => s.detect === "desktop"),
            r = e.value.slices.findIndex((s) => s.detect === "mobile");
          if (document.querySelectorAll(".SliceDownloadList").length < 2)
            return;
          ((!m.value && t > r) || (m.value && t < r)) &&
            (u.set(".Slices", { display: "flex", flexDirection: "column" }),
            u.set(document.querySelectorAll(".SliceDownloadList")[1], {
              marginTop: 0,
            }),
            u.set(document.querySelectorAll(".SliceDownloadList")[0], {
              order: 2,
            }));
        }
      });
      const { data: e, error: f } =
        (([n, _] = L(() =>
          U(`get-page-${c.params.uid}-${l.value}`, G, {
            query: X,
            params: {
              language: l.value,
              uid: c.params.uid,
              types: N.map((t) => t.type),
            },
          }),
        )),
        (n = await n),
        _(),
        n);
      if (!e.value || f.value)
        throw (
          console.warn(`get-page-${c.params.uid}-${l.value}`, f),
          T({ statusCode: 404, statusMessage: "Page Not Found", fatal: !0 })
        );
      h((g = e.value) == null ? void 0 : g._translations);
      const i = q({
        addDirAttribute: !0,
        identifierAttribute: "id",
        addSeoAttributes: !0,
      });
      return (
        (i.value.link = i.value.link.map((t) => ((t.href = B(t.href)), t))),
        H(i),
        $(e.value.seo),
        (t, r) => {
          const y = O,
            s = Q,
            k = R,
            w = W;
          return (
            p(),
            S(
              "div",
              { class: M(["Page", a(e)._type]) },
              [
                a(e)._type === "pageXdefi" ||
                a(e)._type === "pageAbout" ||
                a(e)._type === "pageSecurity"
                  ? (p(),
                    S("div", K, [
                      d(y, { "page-type": a(e)._type }, null, 8, ["page-type"]),
                    ]))
                  : v("", !0),
                d(k, null, {
                  default: E(() => [
                    a(x) ? (p(), V(s, { key: 0, "is-home": !1 })) : v("", !0),
                    Y,
                  ]),
                  _: 1,
                }),
                d(w, { slices: a(e).slices }, null, 8, ["slices"]),
              ],
              2,
            )
          );
        }
      );
    },
  },
  oe = b(Z, [["__scopeId", "data-v-4fe76a0f"]]);
export { oe as default };
