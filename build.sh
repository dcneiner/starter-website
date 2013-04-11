rm -Rf js/*
mkdir js/min

cat src/js/application.js \
src/js/starter.core.js \
src/js/downloadify.js \
src/js/jquery.pixel.checkboxwidget.js \
src/js/jquery.pixel.inputfocus.js > js/min/custom.js

#cat src/js/downloadify.js | pack > js/downloadify.min.js

cat src/js/swfobject.js src/js/jquery-1.3.2.min.js src/js/sh_main.min.js src/js/sh_javascript.min.js js/min/custom.js > js/engine.js

rm -Rf js/min

cat src/css/reset.css \
src/css/text.css \
src/css/960.css \
src/css/sh_style.css \
src/css/layout.css  > css/live.css

#cat css/live.css | sed -e 's|\.\./||g' > css/live.inline.css

cat src/inc/header.html src/inc/external.html src/inc/footer.html > index.html
#cat src/inc/header.html src/inc/inline.html src/inc/footer.html > inline.html