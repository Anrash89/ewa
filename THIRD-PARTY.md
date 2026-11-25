# Third-party components

- UI tokens: supplied mi-kit, neutral theme and base tokens; generated with its bundled build.mjs. No private package registry or access token is used.
- Onest and Golos Text: SIL Open Font License 1.1. Files from @fontsource-variable/onest 5.2.8 and @fontsource-variable/golos-text 5.2.8. License files: fonts/Onest-OFL.txt and fonts/Golos-OFL.txt.
- SheetJS Community Edition 0.20.3: Apache-2.0, https://sheetjs.com/, https://git.sheetjs.com/sheetjs/sheetjs .
- mp4-muxer 5.2.2: MIT, https://github.com/Vanilagy/mp4-muxer ; license: vendor/mp4-muxer-LICENSE.
- h264-mp4-encoder 1.0.12: MIT wrapper, https://github.com/TrevorSundberg/h264-mp4-encoder ; license: vendor/h264-LICENSE.md. It contains minih264 (public domain) and libmp4v2 (MPL-1.1). Corresponding source: https://github.com/TrevorSundberg/h264-mp4-encoder/tree/master and its pinned minih264/libmp4v2 submodules. MPL text: vendor/MPL-1.1.txt.

Fonts and codecs are bundled locally. No third-party font or video service is contacted during use. Local files may be cached by the browser.
