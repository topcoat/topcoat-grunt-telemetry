module.exports.register = register = function(Handlebars, options) {

  /**
   * Extract the content from the body tag of an html page
   *
   * @example
   *    {{#extract}}
   *       content
   *    {{/extract}}
   */
  Handlebars.registerHelper('extract', function(context) {
    var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
    return pattern.exec(context.fn(this))[1];
  });

};