# WordPress Media Uploader

Inpired on [amostajo/wordpress-media-uploader](https://github.com/amostajo/wordpress-media-uploader), this jquery library converts any link `<a>` or `<button>` into a media uploader input.

The Media Uploader will pop-up WordPress Media Library, and will allow to upload and or select uploaded media from library.

## Install

Npm command:
```
npm install ...
```

## Usage

First enqueue script:

```php
// (1) Make sure WP media gallery is enqueued
wp_enqueue_media();

// (2) Enqueue "Wordpress Media Uploader"
wp_enqueue_script(
    'wp-media-uploader',
    PATH_TO_FILE . '/jquery.wp-media-uploader.min.js',
    [ 'jquery', 'jquery-ui-core' ],
    '1.0.0',
    true
);
```

Then an HTML element with these essential attributes:
```html
<a class="insert-media"
    data-editor="my-editor"
    role="media-uploader"
>
    Insert into post
</a>
```

## License

MIT - (c) 2020 [10 Quality Studio](https://www.10quality.com/).