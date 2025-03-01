const baseURL="dhruvhaldar.vercel.app";const routes={"/":true,"/about":true,"/work":true,"/blog":false,"/gallery":true};const protectedRoutes={"/work/mars-mission":false};const style = {
  theme: "light", // dark | light
  neutral: "slate", // sand | gray | slate
  brand: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "violet", // Not used
  solid: "contrast", // color | contrast
  solidStyle: "flat", // flat | plastic
  border: "rounded", // rounded | playful | conservative
  surface: "translucent", // filled | translucent
  transition: "all", // all | micro | macro
};;const effects={mask:{cursor:true,x:0,y:0,radius:75},gradient:{display:true,x:50,y:0,width:150,height:200,tilt:0,colorStart:"brand-background-strong",colorEnd:"static-transparent",opacity:70},dots:{display:false,size:64,color:"neutral-on-background-weak",opacity:60},lines:{display:false,color:"neutral-alpha-weak",opacity:60},grid:{display:false,color:"neutral-alpha-medium",opacity:50}};const display={location:false,time:false};const mailchimp={action:"https://url/subscribe/post?parameters",effects:{mask:{cursor:false,x:100,y:0,radius:100},gradient:{display:true,x:100,y:50,width:100,height:100,tilt:-45,colorStart:"accent-background-strong",colorEnd:"static-transparent",opacity:100},dots:{display:false,size:24,color:"brand-on-background-weak",opacity:100},lines:{display:false,color:"neutral-alpha-weak",opacity:100},grid:{display:false,color:"neutral-alpha-weak",opacity:100}}};export{routes,protectedRoutes,effects,style,display,mailchimp,baseURL};
