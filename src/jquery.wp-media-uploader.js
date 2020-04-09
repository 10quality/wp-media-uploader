/*!
 * WordPress Media Uploader.
 * jQuery plugin and script.
 * @author 10 Quality Studio <https://www.10quality.com/>
 * @version 0.9.0
 * @license MIT
 */
( function( $ ) {
    /**
     * jQuery plugin.
     * @since 0.9.0
     *
     * @param {object} options
     *
     * @return {object}
     */
    $.fn.wp_media_uploader = function( options )
    {
        /**
         * Check external function requests.
         * @since 1.0.0
         * @throws error
         */
        if ( typeof options === 'string' ) {
            if ( window.media_uploaders === undefined )
                throw '001: No Media Uploader has been initialized';
            var id = $( this ).attr( 'id' );
            if ( window.media_uploaders[id] === undefined )
                throw '002: No Media Uploader has been initialized on DOM element #' + id;
            if ( window.media_uploaders[id][options] === undefined
                || typeof window.media_uploaders[id][options] !== 'function'
            )
                throw '003: Function call does not exist';
            window.media_uploaders[id][options]();
        }
        /**
         * Self reference.
         * @since 1.0.0
         */
        var self = this;
        self.$el = $( this );
        /**
         * DOM element where to render results.
         * @since 1.0.0
         */
        self.$target = undefined;
        /**
         * Template used to render.
         * @since 1.0.0
         */
        self.templates = {
            image: undefined,
            video: undefined,
            file: undefined,
            embed: undefined,
        };
        /**
         * Plugin options.
         * @since 1.0.0
         * @var {object}
         */
        self.options = $.extend( {
            /**
             * Input name
             * @var {string}
             */
            name: self.$el.attr( 'name' ) || undefined,
            /**
             * Input value
             * @var {string}
             */
            name: self.$el.attr( 'value' ) || undefined,
            /**
             * ID of The Media Gallery uploader.
             * @var {string}
             */
            editor: self.$el.data( 'editor' ) || undefined,
            /**
             * Element set as target placeholder for media results.
             * @var {string}
             */
            target: self.$el.data( 'target' ) || 'after',
            /**
             * Flag that indicates if plugin should render results. 
             * @var {bool}
             */
            render: self.$el.data( 'render' ) || true,
            /**
             * Flag that indicates if multiple results are expected. 
             * @var {bool}
             */
            multiple: self.$el.attr( 'multiple' ) || false,
            /**
             * Flag that indicates results should be cleared when a new selection is being rendered.
             * @var {bool}
             */
            clearOnSelection: self.$el.data( 'clear-on-selection' ) || true,
            /**
             * Flag that indicates results can be cleared.
             * @var {bool}
             */
            allowClear: self.$el.data( 'allow-clear' ) || true,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateImage: self.$el.data( 'template-image' ) || undefined,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateVideo: self.$el.data( 'template-video' ) || undefined,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateFile: self.$el.data( 'template-file' ) || undefined,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateEmbed: self.$el.data( 'template-embed' ) || undefined,
            /**
             * Callback function with media results as parameter, called after render process has finished.
             * @var {function}
             */
            success: undefined,
            /**
             * Callback function that filters captured media before rendering.
             * @var {function}
             */
            mediaFilter: undefined,
            /**
             * Callback function that maps captured media before rendering.
             * @var {function}
             */
            mediaMap: undefined,
            /**
             * Whether or not to receive an ID value instead of a url.
             * @var {string}
             */
            idValue: self.$el.data( 'id-value' ) || true,
            /**
             * Whether or not to display input.
             * @var {string}
             */
            showInput: self.$el.data( 'show-input' ) || false,
            /**
             * Whether or not to display input.
             * @var {string}
             */
            inputCssClass: self.$el.data( 'input-class' ) || undefined,
        }, options );
        /**
         * Creates a unique ID.
         * @since 1.0.0
         * 
         * @link https://stackoverflow.com/questions/4872380/uniqid-in-javascript-jquery
         *
         * @param {string} prefix
         * @param {bool} more_entropy
         *
         * @return string
         */
        self.uniqid = function( prefix, more_entropy )
        {
            var id = Date.now() / 1000;
            id = id.toString( 16 ).split( '.' ).join( '' );
            while( id.length < 14 ){
                id += '0';
            }
            var more = '';
            if ( more_entropy !== undefined && more_entropy === true ) {
                more = '.' + Math.round( Math.random() * 100000000 );
            }
            return ( prefix !== undefined ? prefix : '' ) + id + more;
        };
        /**
         * Inits plugin.
         * @since 1.0.0
         */
        self.ready = function()
        {
            // Init global references if needed
            if ( window.media_uploaders === undefined )
                window.media_uploaders = {};
            // Init ID if needed
            if ( self.$el.attr( 'id' ) === undefined )
                self.$el.attr( 'id', 'uploader-' + self.uniqid() );
            // Assign targer
            switch ( self.options.target ) {
                case 'before':
                    var target_id = 'uploader-target-' + self.uniqid();
                    $( '<div id="' + target_id + '"></div>' ).insertBefore( self.$el );
                    self.$target = $( '#' + target_id );
                    break;
                case 'after':
                    var target_id = 'uploader-target-' + self.uniqid();
                    $( '<div id="' + target_id + '"></div>' ).insertAfter( self.$el );
                    self.$target = $( '#' + target_id );
                    break;
                case 'inside':
                    self.$target = self.$el;
                    break;
                default:
                    if ( $( self.target ).length )
                        self.$target = $( self.target );
                    break;
            }
            // Stop if no target has been stablished
            if ( self.$target === undefined )
                return;
            // Check on templates
            var $template = undefined;
            if ( self.options.templateImage ) {
                $template = $( self.options.templateImage );
                if ( $template.length )
                    self.templates.image = $template.html();
            }
            if ( self.options.templateVideo ) {
                $template = $( self.options.templateVideo );
                if ( $template.length )
                    self.templates.video = $template.html();
            }
            if ( self.options.templateFile ) {
                $template = $( self.options.templateVideo );
                if ( $template.length )
                    self.templates.file = $template.html();
            }
            if ( self.options.templateEmbed ) {
                $template = $( self.options.templateVideo );
                if ( $template.length )
                    self.templates.embed = $template.html();
            }
            // Set default templates
            self.set_default_templates();
            // General options override
            if ( self.options.multiple )
                self.options.clearOnSelection = true;
            // Bind listener
            window.send_to_editor = self.on_send_to_editor;
        };
        /**
         * Destroys plugin.
         * @since 1.0.0
         */
        self.destroy = function()
        {
            self.$target.remove();
            window.media_uploaders[self.$el.attr( 'id' )] = undefined;
            self = undefined;
        };
        /**
         * Renders media into target.
         * @since 1.0.0
         *
         * @param {object} media
         */
        self.render = function ( media )
        {
            if ( !self.options.render ) return;
            if ( self.$target ) {
                if ( self.options.clearOnSelection )
                    self.$target.html( '' );
                $.each( media, function (i) {
                    self.$target.append( self.render_media(this) );
                } );
            }
        }
        /**
         * Returns media as a rendered using a template.
         * @since 1.0.0
         *
         * @param {object} media
         *
         * @return {string}
         */
        self.render_media = function ( media ) {
            $html = $( self.templates[media.type] );
            // General settings
            $html.find( 'input' ).attr( 'type', self.options.showInput ? 'text' : 'hidden' );
            if ( self.options.name )
                $html.find( 'input' ).attr( 'name', name + ( self.options.multiple ? '[]' : '' ) );
            if ( self.options.value )
                $html.find( 'input' ).attr( 'value', value );
            if ( !self.options.idValue && media.url )
                $html.find( 'input' ).attr( 'value', media.url );
            if ( self.options.idValue && media.id )
                $html.find( 'input' ).attr( 'value', media.id );
            if ( self.options.inputCssClass )
                $html.find( 'input' ).addClass( self.options.inputCssClass );
            // Type specific
            switch ( media.type ) {
                case 'embed':
                case 'image':
                    $html.find( 'img' ).attr( 'src', media.url );
                    if ( media.alt )
                        $html.find( 'img' ).attr( 'alt', media.alt );
                    $html.find( 'img' ).css( 'max-width', '100%' );
                    $html.find( 'img' ).css( 'width', 'auto' );
                    $html.find( 'img' ).css( 'height', 'auto' );
                    break;
                case 'video':
                    $html.find( 'source' ).attr( 'src', media.url );
                    break;
            }
            return $html.get();
        }
        /**
         * Parse HTML captured from WordPress media library.
         * Editor callback processing function.
         *
         * @param string html HTML sent by wordpress editor.
         */
        self.parse_capture = function ( html )
        {
            var media = [];
            // Shortcode to html
            if ( html.search( /\[[/s/S]+/g ) !== -1 ) {
                // Replace []
                html = html.replace( /\[/g, '<' );
                html = html.replace( /\]/g, '>' );
            }
            $.each( $( html ), function ( index ) {
                if ( $( this ).is( 'video' ) && $( this ).attr( 'mp4' ) !== undefined ) {
                    media.push( {
                        type: 'video',
                        url: $(this).attr('mp4'),
                        img: $(this).attr('img'),
                        alt: 'MP4 video',
                        id: $(this).attr('id')
                    } );
                } else if ( $( this ).find( 'img' ).length > 0 ) {
                    media.push( {
                        type: 'image',
                        url: $(this).find( 'img' ).attr( 'src' ),
                        alt: $(this).find( 'img' ).attr( 'alt' ),
                        id: $(this).find( 'img' ).attr( 'class' ).replace( /[A-Za-z\-\s]/g, '' )
                    } );
                } else if ( $( this ).is( 'img' ) ) {
                    media.push( {
                        type: 'image',
                        url: $( this ).attr( 'src' ),
                        alt: $( this ).attr( 'alt' ),
                        id: $( this ).attr( 'class' ).replace( /[A-Za-z\-\s]/g, '' )
                    } );
                } else if ( $( this ).attr( 'href' ) !== undefined ) {
                    media.push( {
                        type: 'file',
                        url: $(this).attr('href')
                    } );
                } else if ( $( this ).is( 'iframe' ) ) {
                    media.push( {
                        type: 'embed',
                        url: $(this).attr('src'),
                        alt: $(this).attr('alt'),
                        id: $(this).attr('class').replace( /[A-Za-z\-\s]/g, '' ),
                        img: $(this).attr('img'),
                        iframe: $( this ),
                    } );
                } else if ( $( this ).hasClass( 'video-frame' ) ) {
                    media.push( {
                        type: 'embed',
                        url: $( this ).find( 'iframe' ).attr( 'src' ),
                        alt: $( this ).find( 'iframe' ).attr( 'alt' ),
                        id: $( this ).find( 'iframe' ).attr( 'class' ).replace( /[A-Za-z\-\s]/g, '' ),
                        img: $( this ).find( 'iframe' ).attr( 'img' ),
                        iframe: $( this ).find( 'iframe' ),
                    } );
                }
            } );
            if ( self.options.mediaFilter ) {
                media = media.filter( self.options.mediaFilter );
            }
            if ( self.options.mediaMap ) {
                media = media.map( self.options.mediaMap );
            }
            if ( self.options.multiple && media.length > 1 ) {
                while ( media.length > 1 ) {
                    media.pop();
                }
            }
            self.render( media );
            if ( self.options.success ) {
                self.options.success( media );
            }
        };
        /**
         * Sets default templates if none has been provided.
         * @since 1.0.0
         */
        self.set_default_templates = function()
        {
            if ( self.templates.image === undefined ) {
                self.templates.image = '<div class="attachment"><img><input type="text"/></div>';
            }
            if ( self.templates.image === undefined ) {
                self.templates.image = '<div class="attachment"><video controls><source type="video/mp4"></video><input type="text"/></div>';
            }
            if ( self.templates.file === undefined ) {
                self.templates.file = '<div class="attachment"><input type="text"/></div>';
            }
            if ( self.templates.embed === undefined ) {
                self.templates.embed = '<div class="attachment"><img><input type="text"/></div>';
            }
        };
        /**
         * Wordpress editor callback.
         * @since 1.0.0
         * @since 1.0.2 Fixes multiple callers.
         *
         * @param string html   HTML returned by wordpress editor.
         * @param string editor Editor key name.
         */
        self.on_send_to_editor = function ( html, editor )
        {
            if ( self.options.editor === undefined
                || ( this.activeEditor != self.options.editor
                    && editor != self.options.editor
                )
            )
                return self.prev_send_to_editor
                    ? self.prev_send_to_editor(
                        html,
                        this.activeEditor  ? this.activeEditor : editor
                    )
                    : undefined;

            self.parse_capture( html );
        };
        /**
         * Saves previous event.
         * @since 1.0.2
         * @var object
         */
        self.prev_send_to_editor = window.send_to_editor;
        /**
         * End plugin.
         * @since 1.0.0
         */
        self.ready();
        window.media_uploaders[self.$el.attr( 'id' )] = self;
        return self;
    };
    /**
     * DOM search and init on ready.
     */
    $( document ).ready( function() {
        $( '*[role="media-uploader"][data-editor]' ).each( function() {
            $( this ).wp_media_uploader();
        } );
    } );
} )( jQuery );