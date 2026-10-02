import { _ as W } from "./PageDownloadButton.9a7kkcah.js";
import {
  _ as B,
  k as C,
  L as a,
  M as j,
  l as G,
  N as U,
  O as J,
  m as A,
  P as X,
  Q as Y,
  o as v,
  h as k,
  y as t,
  S as H,
  j as c,
  i as w,
  T,
  U as K,
  p as x,
  t as q,
  V as Z,
  W as ee,
  v as te,
  x as oe,
  C as $,
  G as se,
  E as ae,
  z as I,
  A as le,
  D as ne,
  I as L,
  J as ie,
  u as re,
  w as ce,
  c as ue,
  d as pe,
  e as de,
  f as me,
  g as _e,
  q as fe,
  X as ve,
  Y as ye,
  s as $e,
} from "./entry.Bx2--lWY.js";
import { u as he, _ as ge } from "./useSanityData.w2vamrsi.js";
const Se = (l) => (te("data-v-cca44647"), (l = l()), oe(), l),
  He = Se(() => t("div", { class: "HomeHero-posTitleHelper" }, null, -1)),
  ke = { class: "HomeHero-sticky" },
  we = { class: "HomeHero-titleMainItem" },
  xe = { class: "HomeHero-titleMainItem" },
  Ie = { class: "HomeHero-mobileDownload --tac" },
  Ae = {
    __name: "HomeHero",
    props: {
      surtitle: { type: String, required: !1, default: null },
      title: { type: String, required: !1, default: null },
    },
    setup(l) {
      const { desktop: o, mobile: p } = C(),
        y = l,
        h = a(null),
        n = a(null),
        d = a(null),
        m = a(null),
        s = a(null),
        i = a(null),
        g = a(null),
        _ = a(null),
        e = a(null);
      let u = {},
        f = {};
      const S = j(() => {
        var r;
        return (r = y.title) == null ? void 0 : r.split(" ");
      });
      (G(() => {
        (U(h, R), Q());
      }),
        J(() => {
          (u && Object.keys(u).length && u.kill(),
            f && Object.keys(f).length && f.kill());
        }));
      const Q = () => {
          f = A.timeline({
            scrollTrigger: {
              trigger: ".HomeHero-sticky",
              scrub: 1,
              start: "top top",
              end: "+=" + window.innerHeight / 2,
            },
          })
            .to(
              m.value,
              { scale: 0.8, x: 0, autoAlpha: 0, ease: "power1.inOut" },
              0,
            )
            .to(
              n.value,
              { autoAlpha: 0, ease: "power2.inOut", duration: 0.5 },
              0,
            );
          const r = parseInt(
            window.getComputedStyle(e.value, null).getPropertyValue("left"),
          );
          u = A.timeline({ paused: !0 })
            .set(i.value, { x: p.value ? "3rem" : "8rem", autoAlpha: 1 }, 0)
            .set(g.value, { x: p.value ? "-3rem" : "-8rem", autoAlpha: 1 }, 0)
            .to(
              e.value,
              { autoAlpha: 1, duration: 0.2, ease: "power1.inOut" },
              0,
            )
            .fromTo(
              d.value,
              { y: o.value ? "20rem" : "10rem" },
              { y: 0, ease: "power3.out", duration: 1.2 },
              0,
            )
            .fromTo(
              d.value,
              { autoAlpha: 0 },
              { autoAlpha: 1, ease: "power1.inOut", duration: 0.7 },
              0,
            )
            .from(
              document.querySelector(".SliceScrollableAppScreens-wrapper"),
              { y: "20vh", autoAlpha: 0, ease: "power3.out", duration: 1.2 },
              1,
            )
            .fromTo(
              s.value,
              { clipPath: "inset(-50% 100% -50% 0%)" },
              {
                clipPath: "inset(-50% 0% -50% 0%)",
                duration: 0.8,
                ease: "power2.inOut",
              },
              0.2,
            )
            .fromTo(
              e.value,
              { x: 0 },
              {
                x:
                  s.value.getBoundingClientRect().width -
                  _.value.$el.getBoundingClientRect().width -
                  r / 2,
                duration: 1,
                ease: "back.inOut",
              },
              0,
            )
            .to(i.value, { x: 0, ease: "power2.inOut", duration: 0.7 }, 1.3)
            .to(g.value, { x: 0, ease: "power2.inOut", duration: 0.7 }, 1.3)
            .from(
              _.value.$el,
              { autoAlpha: 0, ease: "none", duration: 0.25 },
              1.62,
            )
            .from(
              _.value.$el,
              { scale: 0.7, y: "3rem", ease: "power3.out", duration: 0.8 },
              1.62,
            )
            .to(
              s.value,
              {
                clipPath: "inset(-50% -20% -50% 00%)",
                duration: 0.8,
                ease: "power2.inOut",
              },
              1.3,
            )
            .to(
              e.value,
              {
                x:
                  s.value.getBoundingClientRect().width -
                  e.value.style.left -
                  r,
                duration: 1,
                ease: "back.inOut",
              },
              1.2,
            );
        },
        F = () => {
          u.play();
        },
        R = () => {
          const r = parseInt(
            window.getComputedStyle(e.value, null).getPropertyValue("left"),
          );
          A.set(e.value, {
            x: s.value.getBoundingClientRect().width - e.value.style.left - r,
          });
        };
      return (r, je) => {
        const V = Z,
          E = ee,
          z = X("observe");
        return Y(
          (v(),
          k("section", { ref_key: "refEl", ref: h, class: "HomeHero" }, [
            He,
            t("div", ke, [
              t(
                "div",
                { ref_key: "refTitle", ref: n, class: "HomeHero-title" },
                [
                  t(
                    "h2",
                    {
                      ref_key: "refSurtitle",
                      ref: d,
                      class: "HomeHero-titleUp AppSurtitle-1 --line-prewrap",
                    },
                    H(y.surtitle),
                    513,
                  ),
                  t(
                    "div",
                    {
                      ref_key: "refMaintitleWrap",
                      ref: m,
                      class: "HomeHero-titleMain",
                    },
                    [
                      y.title
                        ? (v(),
                          k(
                            "h1",
                            {
                              key: 0,
                              ref_key: "refMaintitle",
                              ref: s,
                              class: "HomeHero-titleMainInner AppTitle-1",
                            },
                            [
                              t("div", we, [
                                t(
                                  "span",
                                  { ref_key: "refMaintitleLeft", ref: i },
                                  H(c(S)[0]),
                                  513,
                                ),
                              ]),
                              w(
                                V,
                                {
                                  ref_key: "refLogo",
                                  ref: _,
                                  name: "ctrl-logo-small",
                                },
                                null,
                                512,
                              ),
                              t("div", xe, [
                                t(
                                  "span",
                                  { ref_key: "refMaintitleRight", ref: g },
                                  [
                                    T(H(c(S)[1]) + " ", 1),
                                    c(S)[2]
                                      ? (v(),
                                        k(
                                          K,
                                          { key: 0 },
                                          [T(H(c(S)[2]), 1)],
                                          64,
                                        ))
                                      : x("", !0),
                                  ],
                                  512,
                                ),
                              ]),
                            ],
                            512,
                          ))
                        : x("", !0),
                      t(
                        "div",
                        {
                          ref_key: "refDot",
                          ref: e,
                          class: "FooterTitles-dot AppTitle-1",
                        },
                        " . ",
                        512,
                      ),
                    ],
                    512,
                  ),
                  t("div", Ie, [c(o) ? x("", !0) : (v(), q(E, { key: 0 }))]),
                ],
                512,
              ),
            ]),
          ])),
          [[z, { onEnter: F }]],
        );
      };
    },
  },
  Te = B(Ae, [["__scopeId", "data-v-cca44647"]]),
  b = "sliceScrollableAppScreens",
  be = "SliceScrollableAppScreens",
  Me = `
_type == "${b}" => {
  "sliceId": "${b}",
  "componentName": "${be}",
  video { ${$} },
  vimeo,
  "items": items[] {
    ...,
    video { ${$} },
    vimeo,
    iconFile { ${se} }
  }
}
`,
  M = "sliceBlockchainsSearch",
  Ne = "SliceBlockchainsSearch",
  De = `
_type == "${M}" => {
  "sliceId": "${M}",
  "componentName": "${Ne}",
  title,
  text,
  placeholder,
  "blockchains": *[_type == "blockchain" && isFeatured == true] {
    name,
    isFeatured,
    "slug": slug.current,
    icon {
      ${ae}
    },
    "color": color.hex
  }
}
`,
  N = "sliceTitleListVertical",
  Oe = "SliceTitleListVertical",
  Pe = `
_type == "${N}" => {
  "sliceId": "${N}",
  "componentName": "${Oe}",
  surtitle,
  title { ${I} },
  items[] {
    ...,
    video { ${$} },
    vimeo,
    text[] {
      ${le}
    }
  }
}
`,
  D = "sliceTitleListHorizontal",
  Be = "SliceTitleListHorizontal",
  Ce = `
_type == "${D}" => {
  "sliceId": "${D}",
  "componentName": "${Be}",
  surtitle,
  title { ${I} },
  items[] {
    ...,
    video { ${$} },
    vimeo
  }
}
`,
  O = "sliceTitleListGrid",
  qe = "SliceTitleListGrid",
  Le = `
_type == "${O}" => {
  "sliceId": "${O}",
  "componentName": "${qe}",
  surtitle,
  title { ${I} },
  items[] {
    ...,
    video { ${$} },
    vimeo,
  }
}
`,
  P = "sliceFAQ",
  Qe = "SliceFAQ",
  Fe = `
_type == "${P}" => {
  "sliceId": "${P}",
  "componentName": "${Qe}",
  surtitle,
  title { ${I} },
  items,
  button[0] {
    ${ne}
  }
}
`,
  Re = L`*[_type == "pageHome" && language == $language][0]`,
  Ve = L`*[_type == "pageHome" && language == $language][0]{
  "hero": {
    "surtitle": heroSurtitle,
    "title": heroTitle
  },
  "slices": slices[] {
    ${Me},
    ${De},
    ${Pe},
    ${Le},
    ${Ce},
    ${Fe}
  },
  ${ie},
}`,
  Ee = async (l, o) => await l.fetch(Ve, o),
  ze = { class: "HomePage Page" },
  We = {
    __name: "index",
    async setup(l) {
      var s;
      let o, p;
      const { locale: y } = re(),
        { desktop: h } = C(),
        { data: n, error: d } =
          (([o, p] = ce(() =>
            he("get-home", Ee, { query: Re, params: { language: y.value } }),
          )),
          (o = await o),
          p(),
          o);
      if (
        !n.value ||
        d.value ||
        ((s = n.value.slices) == null ? void 0 : s.length) === 0
      )
        throw (
          console.warn(d),
          ue({ statusCode: 404, statusMessage: "Page Not Found", fatal: !0 })
        );
      const m = pe({
        addDirAttribute: !0,
        identifierAttribute: "id",
        addSeoAttributes: !0,
      });
      return (
        (m.value.link = m.value.link.map((i) => ((i.href = de(i.href)), i))),
        me(m),
        _e(n.value.seo),
        (i, g) => {
          const _ = W,
            e = $e,
            u = Te,
            f = ge;
          return (
            v(),
            k("div", ze, [
              w(e, null, {
                default: fe(() => [
                  c(h) ? (v(), q(_, { key: 0, "is-home": !0 })) : x("", !0),
                ]),
                _: 1,
              }),
              w(u, ve(ye(c(n).hero)), null, 16),
              w(f, { slices: c(n).slices }, null, 8, ["slices"]),
            ])
          );
        }
      );
    },
  },
  Xe = B(We, [["__scopeId", "data-v-11ce35e1"]]);
export { Xe as default };
