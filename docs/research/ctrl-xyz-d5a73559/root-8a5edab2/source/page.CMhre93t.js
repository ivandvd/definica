import{z as m,A as c,B as E,C as g,D as $,E as b,F as r,G as M,H as q,I as Q,J as w,K as B}from"./entry.Bx2--lWY.js";const D=[{id:"en",iso:"en-gb",title:"English",icon:"US",isDefault:!0,flag:null},{id:"fr",iso:"fr-fr",title:"French",icon:"FR",flag:null},{id:"de",iso:"de",title:"Deutsch",icon:"DE",flag:null},{id:"es",iso:"es",title:"Español",icon:"ES",flag:null},{id:"pt",iso:"pt-br",title:"Portuguese",icon:"PT",flag:null},{id:"zh-hans",iso:"zh-hans",title:"简体中文",icon:"CN",flag:null},{id:"ru",iso:"ru",title:"Русский",icon:"RU",flag:null},{id:"vi",iso:"vi",title:"Tiếng Việt",icon:"VN",flag:null},{id:"tr",iso:"tr",title:"Türkçe",icon:"TR",flag:null}],H=i=>{const e=i==null?void 0:i.reduce((l,t)=>{var o,s,n,a;if(((o=t==null?void 0:t.slug)==null?void 0:o.current.indexOf("/"))>-1){const d=(s=t==null?void 0:t.slug)==null?void 0:s.current.split("/");l[t==null?void 0:t.language]={parentuid:d[0],uid:d[1]}}else(n=t==null?void 0:t.slug)!=null&&n.current&&(l[t==null?void 0:t.language]={uid:(a=t==null?void 0:t.slug)==null?void 0:a.current});return l},{});return D.forEach(l=>{e[l.id]||(e[l.id]={uid:null,parentuid:null})}),e},F=(i,{maxChars:e=0,pretty:l=!0,suffix:t="...",maxCharsIncludesSuffix:o=!0}={})=>{if(!i)return;if(i.length<=e)return i;const s=o?e-(t==null?void 0:t.length):e;return l?i.split(" ").reduce((n,a,d,v)=>n.totalLength+a.length>=s?(v.splice(1),n):(n.words.push(a),n.totalLength+=a.length,n),{words:[],totalLength:0}).words.join(" ").concat(t):i.slice(0,s).concat(t)},V=(i,e,l)=>{if(e<2)return[i];var t=i.length,o=[],s=0,n;if(t%e===0)for(n=Math.floor(t/e);s<t;)o.push(i.slice(s,s+=n));else if(l)for(;s<t;)n=Math.ceil((t-s)/e--),o.push(i.slice(s,s+=n));else{for(e--,n=Math.floor(t/e),t%n===0&&n--;s<n*e;)o.push(i.slice(s,s+=n));o.push(i.slice(n*e))}return o},z=i=>e=>!!e&&i.every(l=>l in e&&!!e[l]),R=i=>e=>!!e&&i in e&&!!e[i],U=i=>!!i,u="sliceHero",C="SliceHeroVertical",G=`
_type == "${u}" => {
  "sliceId": "${u}",
  "componentName": "${C}",
  "pageType": ^._type,
  "title": title {
    ${m}
  },
  "text": text[] {
    ${c}
  }
}
`,p="sliceMediasList",J="SliceMediasList",K=`
_type == "${p}" => {
  "sliceId": "${p}",
  "componentName": "${J}",
  "items": items[] {
    ...,
    "text": text[] {
      ${c}
    },
    "button": media {
      ${E}
    },
    video { ${g} },
    vimeo
  }
}
`,y="sliceLargeText",P="SliceLargeText",O=`
_type == "${y}" => {
  "sliceId": "${y}",
  "componentName": "${P}",
  text[] {
    ${c}
  },
}
`,f="sliceTitleListTexts",W="SliceTitleListTexts",X=`
_type == "${f}" => {
  "sliceId": "${f}",
  "componentName": "${W}",
  title,
  index,
  texts[] {
    text[] {
      ${c}
    },
  }
}
`,I="sliceEarlyAccess",Y="SliceEarlyAccess",Z=`
_type == "${I}" => {
  "sliceId": "${I}",
  "componentName": "${Y}",
  ...,
  text[] { ${c} }
}
`,h="sliceSecurityList",j="SliceSecurityList",ee=`
_type == "${h}" => {
  "sliceId": "${h}",
  "componentName": "${j}",
  "items": items[] {
    title,
    "text": text[] {
      ${c}
    },
    color,
    link[0] { ${$} },
    icon { ${b} }
  }
}
`,N="sliceBlogArticlesList",te="SliceBlogArticlesList",ie=`
_type == "${N}" => {
  "sliceId": "${N}",
  "componentName": "${te}",
  autofetch == true => {
    "items": *[_type == "blogArticle" && language == $language]|order(date desc) {
      slug,
      title,
      date,
      "categories": categories[0...3]->{ title, slug },
      image { ${r} },
    }
  },
  autofetch == false => {
    items[] {
      ...article->{
        slug,
        title,
        date,
        "categories": categories[0...3]->{ title, slug },
        image { ${r} }
      }
    }
  },
  "categories": *[_type == "blogCategory" && language == $language]|order(orderRank) {
    ...
  },
}
`,le=i=>(i.items=i.items.map(e=>({...e,title:F(e==null?void 0:e.title,{maxChars:80,suffix:" (...)"})})),i),se="sliceBlogArticleHero",ne="SliceBlogArticleHero",oe=`
{
  _type == "blogArticle" => {
    "sliceId": "${se}",
    "componentName": "${ne}",
    title,
    date,
    image { ${r} },
    "intro": intro[] {
      ${c}
    },
    "categories": categories[]->{ title},
  }
}
`,ce="sliceArticle",ae="SliceArticle",$e=`
{
  _type == "blogArticle" => {
    "sliceId": "${ce}",
    "componentName": "${ae}",
    "content": content[] {
      ${c}
    },
  }
}
`,x="sliceToken",re="SliceToken",me=`
_type == "${x}" => {
  "sliceId": "${x}",
  "componentName": "${re}",
  title,
  text[] { ${c} },
  items[] {
    title,
    text,
    link[0] { ${$} },
    video { ${g} },
    vimeo
  }
}
`,S="sliceMetrics",de="SliceMetrics",ge=`
_type == "${S}" => {
  "sliceId": "${S}",
  "componentName": "${de}",
  title,
  text[] { ${c} },
  items[] {
    title,
    label,
    coingeckoValue,
    unit,
    link[0] { ${$} }
  }
}
`,_="sliceStacking",ue="SliceStacking",pe=`
_type == "${_}" => {
  "sliceId": "${_}",
  "componentName": "${ue}",
  title,
  text[] { ${c} },
  items[] {
    title,
    text,
    link[0] { ${$} },
    icon { ${b} },
    iconFile { ${M} }
  }
}
`,T="sliceDownloadList",ye="SliceDownloadList",fe=`
_type == "${T}" => {
  "sliceId": "${T}",
  "componentName": "${ye}",
  title,
  subtitle[] { ${c} },
  detect,
  "items": items[] {
   link { ${q} },
   image { ${r} },
   color
  }
}
`,L="sliceTitleTextLink",Ie="SliceTitleTextLink",he=`
_type == "${L}" => {
  "sliceId": "${L}",
  "componentName": "${Ie}",
  title { ${m} },
  index,
  text[] {
    ${c}
  },
  link[0] {
    ${$}
  },
}
`,k="sliceTeam",Ne="SliceTeam",xe=`
_type == "${k}" => {
  "sliceId": "${k}",
  "componentName": "${Ne}",
  title { ${m} },
  "members": *[_type == "teamMember"] {
    name,
    job,
    socials[] {
      "link": socialLink {
        ${q}
      },
      "icon": socialIcon
    }
  }
}
`,Se=i=>{i.members.map(t=>{var o,s;return t.socials=(s=(o=t.socials)==null?void 0:o.filter(U))==null?void 0:s.filter(z(["icon","link"])),t});let e=i.members||[];e&&e.length<10&&(e=[...e,...e,...e]);let l=V(e,3,!0);return i.membersArrays=l,i},A="sliceJoinTeam",_e="SliceJoinTeam",Te=`
_type == "${A}" => {
  "sliceId": "${A}",
  "componentName": "${_e}",
  title,
  text[] {
    ${c}
  },
  "button": link[0] {
    ${$},
    "icon": "three-dots"
  },
  video { ${g} },
  vimeo
}
`,Ae=Q`*[slug.current == $uid && language == $language][0]`,Le=Q`*[slug.current == $uid && _type in $types && language == $language] | order(_updatedAt desc)[0]{
    _type,
    title,
    "hero": {
      "title": heroTitle {
        ${m}
      } ,
      "text": heroText[] {
        ${c}
      },
    },
    "slices": [
      ${oe},
      ${$e},
      ...slices[] {
        ${G},
        ${K},
        ${O},
        ${X},
        ${ee},
        ${fe},
        ${ie},
        ${me},
        ${ge},
        ${pe},
        ${he},
        ${xe},
        ${Te},
        ${Z}
      }
    ],
    ${w},
    ${B}
}`,be=async(i,e)=>{var t,o;const l=await i.fetch(Le,e);if(l){l._translations=H(l._translations),l.slices=l.slices.filter(R("sliceId")),l.seo||(l.seo={title:l.title,description:l.title,image:((o=(t=l.slices.find(a=>a.sliceId==="sliceBlogArticleHero"))==null?void 0:t.image)==null?void 0:o.fullUrl)||null});const s=l.slices.findIndex(a=>a.sliceId==="sliceBlogArticlesList");s!==-1&&(l.slices[s]=le(l.slices[s]));const n=l.slices.findIndex(a=>a.sliceId==="sliceTeam");n!==-1&&(l.slices[n]=Se(l.slices[n]))}return l};export{be as g,Ae as p};
