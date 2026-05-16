import gulp from 'gulp';
import { src, dest, watch, series, parallel } from 'gulp';
import ttf2woff2 from 'gulp-ttf2woff2';
import browserSync from 'browser-sync';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import fileInclude from 'gulp-file-include';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import { deleteAsync } from 'del';
import merge from 'merge-stream';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import svgmin from 'gulp-svgmin';
import gcmq from 'gulp-group-css-media-queries';

import changed from 'gulp-changed';
import cache from 'gulp-cache';

const bs = browserSync.create();

// Очистка билда
async function cleanDist() {
  return await deleteAsync(['docs']);
}

// Очистка кэша: npm run clear
export const clear = (done) => {
  return cache.clearAll(done);
};

// HTML (сборка инклюдов)
function html() {
  return src('src/*.html')
    .pipe(fileInclude({ prefix: '@@', basepath: './src/' }))
    .pipe(dest('docs'))
    .pipe(bs.stream());
}

function styles() {
  return src('src/styles/main.scss', { sourcemaps: true })
    .pipe(
      scss
        .sync({
          api: 'modern-compiler',
          outputStyle: 'compressed',
          loadPaths: ['src/styles'],
        })
        .on('error', scss.logError)
    )
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
    .pipe(gcmq()) // Группируем медиа-запросы для улучшения Performance
    .pipe(cleanCss()) // Финальное сжатие
    .pipe(dest('docs/styles', { sourcemaps: '.' }))
    .pipe(bs.stream());
}

// JS
function scripts() {
  return src(['src/js/**/_*.js', 'src/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(
      terser().on('error', (e) => {
        console.error('JS Error: ', e.message);
      })
    )
    .pipe(dest('docs/js'))
    .pipe(bs.stream());
}

// Шрифты
function fonts() {
  const dist = 'docs/fonts';
  return src('src/fonts/**/*.ttf', { encoding: false })
    .pipe(changed(dist, { extension: '.woff2' }))
    .pipe(ttf2woff2())
    .pipe(dest(dist))
    .pipe(bs.stream());
}

// Imagemin

function images() {
  const dist = 'docs/images';

  return src(
    ['src/images/**/*.{jpg,jpeg,png,webp,avif}', '!src/images/icons/**/*'],
    { encoding: false }
  )
    .pipe(changed(dist)) // Пропускаем файлы, которые не менялись [cite: 2026-02-09]
    .pipe(
      cache(
        imagemin([
          imagemin.mozjpeg({ quality: 80, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
        ])
      )
    )
    .pipe(dest(dist)) // Сохраняем оптимизированные файлы (включая оригиналы и готовые webp) [cite: 2026-02-24]
    .pipe(webp()) // Создаем .webp копии для jpg/png [cite: 2026-02-24]
    .pipe(dest(dist))
    .pipe(bs.stream());
}

// New Sprite
function sprite(done) {
  return src('src/images/icons/**/*.svg')
    .pipe(
      svgmin({
        multipass: true,
        plugins: ['preset-default', 'removeDimensions', 'collapseGroups'],
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          const shapes = 'path, circle, rect, ellipse, polygon, polyline';
          const $shapes = $(shapes);
          const totalShapes = $shapes.length;

          // 1. ЛОГИКА: Если иконка простая (от 1 до 4 элементов)
          if (totalShapes > 0 && totalShapes <= 4) {
            $shapes.each(function (i) {
              const $el = $(this);

              // Назначаем переменные. По умолчанию — черный (#000)
              // Если в CSS переменная не задана, иконка просто будет черной
              $el.attr('fill', `var(--color-${i + 1}, #000)`);

              // Если у элемента была обводка (stroke), тоже вешаем переменную
              if ($el.attr('stroke')) {
                $el.attr('stroke', `var(--stroke-${i + 1}, #000)`);
              }
              // Transition
              $el.attr(
                'style',
                'transition: fill var(--icon-duration, 0.3s) ease, stroke var(--icon-duration, 0.3s) ease;'
              );
            });

            // Очистка: удаляем инлайновые стили и теги <style>
            // Это нужно, чтобы внешние CSS-переменные имели приоритет
            // $('*').removeAttr('style');
            $('style').remove();
          }

          // 2. ЛОГИКА: Если элементов > 4 (например, брендовый Gmail)
          // Файл проходит "как есть" с родными цветами макета
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../stack.svg',
          },
        },
      })
    )
    .pipe(dest('docs/images/icons'))
    .on('end', done);
}

// Сервер
function server() {
  bs.init({
    server: { baseDir: 'docs' },
    notify: false,
    open: true,
  });
}

// Наблюдение
function watching() {
  watch(['src/**/*.html'], html);
  watch(['src/styles/**/*.scss'], styles);
  watch(['src/js/**/*.js'], scripts);
  watch(['src/images/**/*', '!src/images/icons/**/*'], images);
  watch(['src/images/icons/**/*.svg'], sprite);
  watch(['src/fonts/**/*'], fonts);
}

export { html, styles, scripts, fonts, images, sprite, cleanDist };

export default series(
  cleanDist,
  parallel(fonts, html, styles, scripts, images, sprite),
  parallel(server, watching)
);
