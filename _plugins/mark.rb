module Jekyll
    class MarkRenderTag < Liquid::Tag

      def initialize(tag_name, text, tokens)
        super
        @text = text
      end

      def render(context)
        "<mark>#{@text}</mark>"
      end
    end
  end

  Liquid::Template.register_tag('mark', Jekyll::MarkRenderTag)
