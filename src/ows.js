/**
 * Helper functions for OGC Web Services
 */
const $ = jQuery = require('jQuery');
const L = require('leaflet');
require('./legend_control.js');

class OwsHelper {
    constructor(url){
        this.url = url
    }

    /*
    * \brief Get the capabilities for an OWS web service.
    * 
    * @param options: Object containing:
    *  success: function to be called on success, which will be given the XML capabilities document
    *  error: function to be called upon error
    *  service: Optional parameter declaring the OWS service to get capabilities for (e.g. wms, wfs).
    *             Defaults to WMS 
    */
    getCapabilities (options){
        if(this.url.indexOf('?') === -1){
            this.url += '?'
        }
        else {
            this.url += '&'
        }

        if (options.service){
            var capabilityURL = this.url + 'request=GetCapabilities&service=' + options.service
        }
        else {
            var capabilityURL = this.url + 'request=GetCapabilities&service=wms'
        }

        $.ajax({
                type: "GET",
            headers: {'Access-Control-Allow-Credentials': true},
                xhrFields: {
                    withCredentials: true
                },
                url: capabilityURL,
                dataType: "xml",
                success: function(xml) {
                    options.success(xml);
                },
                error: function(){options.error}
            })

    }
    
    static createLegend (layer){
        
        var successFunc = function(xml) {
                        var result = $(xml).find('ServiceException[code="LayerNotDefined"]')
                        if (result)
                            console.log(result[0])
                            //MT.Dom.showMessage("No legend is available for this layer:\n"+result[0].textContent, "WMS does not provide legend");
                    }
                    
        var errorFunc = function(xhr, status, error){
                       if (status === 'parsererror')
                       {
                            legendObjs[name] = L.wmsLegend(url, layer._map)
                       }
                       else{
                           console.log(status)
                           console.log(error)
                       }

                   }
        
        var legends = layer.getLegendGraphic()
        var legendObjs = {}
        for (var name in legends)
        {
            var url = legends[name]
            $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "xml",
                    success: successFunc,

                   /*
                    * Because we specified the dataType as xml, then if the URL is valid an image will be
                    * returned, which will cause jquery to invoke the error function...
                    */
                   error: errorFunc
                })
        }
        return legendObjs
    }
}

module.exports.OwsHelper = OwsHelper