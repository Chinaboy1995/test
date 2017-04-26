define("leaflet/chartLayer",["leaflet"],function(e){var t={errorUrl:"",tempurl:Project_ParamConfig.ChartLayerUrl};e.TileLayer.ChartLayer=e.TileLayer.extend({initialize:function(n,r){r=e.setOptions(this,r),r.errorTileUrl=t.errorUrl;var i=t.tempurl;this.url=i+"{s}/{x}.jpg",e.TileLayer.prototype.initialize.call(this,this.url,r)}}),e.TileLayer.ChartLayer.prototype.getTileUrl=function(t){return e.Util.template(this._url,e.extend({s:function(){var n=t.z,r=t.y,i=levDir=rowDir="";return n<2?levDir="LN"+n.toString():n<12?levDir="L0"+(n-2).toString():levDir="L"+(n-2).toString(),rowDir="R"+e.tileLayer.getHexString(r),i=levDir+"/"+rowDir,i},x:"C"+e.tileLayer.getHexString(t.x)}))},e.tileLayer.getHexString=function(e){var t=e.toString(16);switch(t.length){case 1:t="0000000"+t;break;case 2:return t="000000"+t;case 3:t="00000"+t;break;case 4:t="0000"+t;break;case 5:t="000"+t;break;case 6:t="00"+t;break;case 7:t="0"+t;break;default:}return t},e.tileLayer.ChartLayer=function(t,n){return new e.TileLayer.ChartLayer(t,n)}});