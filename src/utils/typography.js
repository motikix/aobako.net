import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    "html,body,h1,h2,h3,h4,h5,h6": {
      color: `#34314c`,
      fontFamily: [
        `-apple-system`,
        `BlinkMacSystemFont`,
        `Helvetica Neue`,
        `"Yu Gothic"`,
        `YuGothic`,
        `Verdana`,
        `Meiryo`,
        `"M+ 1p"`,
        `sans-serif`,
      ].join(','),
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
