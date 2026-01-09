// types/global.d.ts

// Allow importing CSS modules (e.g. styles.module.css)
declare module '*.module.css' {
    const classes: { readonly [className: string]: string };
    export default classes;
}

// Allow importing plain/global CSS (e.g. globals.css)
declare module '*.css' {
    const css: string;
    export default css;
}