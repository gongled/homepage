module Jekyll
    class AsideRenderTag < Liquid::Tag
  
      def initialize(tag_name, text, tokens)
        super
        @text = text
      end
  
      def render(context)
        "<aside class='aside-text-right'>#{@text}</aside>"
      end
    end
  end
  
  Liquid::Template.register_tag('aside', Jekyll::AsideRenderTag)