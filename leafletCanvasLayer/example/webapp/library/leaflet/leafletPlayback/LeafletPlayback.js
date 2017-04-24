// UMD initialization to work with CommonJS, AMD and basic browser script include
//linghuam 修改后版本 V1.0  20161228
(function(factory) {
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module === 'object' && typeof module.exports === "object") {
        // Node/CommonJS
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
}(function(L) {

    L.Playback = L.Playback || {};

    L.Playback.MoveableMarker = L.Marker.extend({

        initialize: function(startLatLng, options, feature) {
            var marker_options = options.marker || {};

            //根据track dataobj生成marker_options
            if (jQuery.isFunction(marker_options)) {
                marker_options = marker_options(feature);
            }

            L.Marker.prototype.initialize.call(this, startLatLng, marker_options);

            this.popupContent = '';
            this.feature = feature;

            if (marker_options.getPopup) {
                this.popupContent = marker_options.getPopup(feature);
            }

            if (options.popups) {
                this.bindPopup(this.getPopupContent() + startLatLng.toString());
            }

            if (options.labels) {
                if (this.bindLabel) {
                    this.bindLabel(this.getPopupContent(), { noHide: true });
                } else {
                    console.log("Label binding requires leaflet-label (https://github.com/Leaflet/Leaflet.label)");
                }
            }
        },

        getPopupContent: function() {
            if (this.popupContent !== '') {
                return '<b>' + this.popupContent + '</b><br/>';
            }

            return '';
        },

        move: function(latLng, transitionTime) {
            // Only if CSS3 transitions are supported
            if (L.DomUtil.TRANSITION) {
                if (this._icon) {
                    this._icon.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
                    if (this._popup && this._popup._wrapper)
                        this._popup._wrapper.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
                }
                if (this._shadow) {
                    this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
                }
            }
            this.setLatLng(latLng);
            if (this._popup) {
                this._popup.setContent(this.getPopupContent() + this._latlng.toString());
            }
        },

        // modify leaflet markers to add our roration code
        /*
         * Based on comments by @runanet and @coomsie 
         * https://github.com/CloudMade/Leaflet/issues/386
         *
         * Wrapping function is needed to preserve L.Marker.update function
         */
        _old__setPos: L.Marker.prototype._setPos,

        /*原始代码
    _updateImg: function (i, a, s) {
        a = L.point(s).divideBy(2)._subtract(L.point(a));
        var transform = '';
        transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
        transform += ' rotate(' + this.options.iconAngle + 'deg)';
        transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
        i.style[L.DomUtil.TRANSFORM] += transform;
    },*/

        //linghuam edit
        _updateImg: function(i, a, s) {
            a = L.point(s).divideBy(2)._subtract(L.point(a));
            var transform = '';
            transform += ' rotate(' + this.options.iconAngle + 'deg)';
            i.style[L.DomUtil.TRANSFORM] += transform;
            i.style.transformOrigin = "50% 50%"; //linghuam 设置旋转的参照点为中心点，解决船舶偏移问题
        },

        setIconAngle: function(iconAngle) {
            this.options.iconAngle = iconAngle;
            if (this._map)
                this.update();
        },

        _setPos: function(pos) {
            if (this._icon) {
                this._icon.style[L.DomUtil.TRANSFORM] = "";
            }
            if (this._shadow) {
                this._shadow.style[L.DomUtil.TRANSFORM] = "";
            }

            this._old__setPos.apply(this, [pos]);
            if (this.options.iconAngle) {
                var a = this.options.icon.options.iconAnchor;
                var s = this.options.icon.options.iconSize;
                var i;
                if (this._icon) {
                    i = this._icon;
                    this._updateImg(i, a, s);
                }

                if (this._shadow) {
                    // Rotate around the icons anchor.
                    s = this.options.icon.options.shadowSize;
                    i = this._shadow;
                    this._updateImg(i, a, s);
                }

            }
        }

    });

    L.Playback.Track = L.Class.extend({

        initialize: function(map, dataObj, options) {
            this._map = map;
            this.options = options || {};
            this._dataObj = dataObj;
            this._ticks = [];
            this._times = [];
            this._marker = null;

            var sampleTimes = dataObj.timePosList;

            for (var i = 0, len = sampleTimes.length; i < len; i++) {
                var ti = sampleTimes[i].time;
                this._times.push(ti);
                this._ticks[ti] = sampleTimes[i];
                if (i === 0) {
                    this._startTime = ti;
                }
                if (i === len - 1) {
                    this._endTime = ti;
                }
            }

            if (!this._trackLineFeatureGroup) {
                this._trackLineFeatureGroup = L.featureGroup([]).addTo(this._map);
            }

            if (!this._trackPointFeatureGroup) {
                this._trackPointFeatureGroup = L.featureGroup([]).addTo(this._map);
            }
        },

        getFirstTick: function() {
            return this._ticks[this._startTime];
        },

        getLastTick: function() {
            return this._ticks[this._endTime];
        },

        getStartTime: function() {
            return this._startTime;
        },

        getEndTime: function() {
            return this._endTime;
        },

        getTimes: function() {
            return this._times;
        },

        getTimeInterval: function(timestamp) {
            var index = this._times.indexOf(timestamp);
            if (index !== -1 && index !== this._times.length - 1) {
                var next = this._times[index + 1];
                var inteval = next - timestamp;
            }
            return inteval;
        },

        tick: function(timestamp) {
            return this._ticks[timestamp];
        },

        getLatLng: function(timestamp) {
            var tick = this.tick(timestamp);
            if (tick) return L.latLng(tick.lat, tick.lng);
        },

        setMarker: function(timestamp, options) {
            var latlng = null;

            // if time stamp is not set, then get first tick
            if (timestamp) {
                latlng = this.getLatLng(timestamp);
            } else {
                latlng = this.getLatLng(this._startTime);
            }

            if (latlng) {
                this._marker = new L.Playback.MoveableMarker(latlng, options, this._dataObj);
            }

            return this._marker;
        },

        getMarker: function() {
            return this._marker;
        },

        removeMarker: function() {
            if (this._map.hasLayer(this._marker)) {
                this._map.removeLayer(this._marker);
                this._marker = null;
            }
        },

        createTrackPoint: function(timestamp) {
            var latlng = this.getLatLng(timestamp);
            if (latlng) var cricleMarker = L.circleMarker(latlng, this.options.OriginCircleOptions);
            var infoObj = this.tick(timestamp);
            if (cricleMarker && infoObj) cricleMarker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions());
            //将最后一个点的信息绑定到船舶上
            if (this._marker) {
                this._marker.unbindTooltip();
                this._marker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions());
            }
            return cricleMarker;
        },

        getTooltipText: function(targetobj) {
            var content = [];
            content.push('<table>');
            content.push('<tr><td>批号:</td><td>' + targetobj.info_ph + '</td></tr>');
            content.push('<tr><td>经度:</td><td>' + targetobj.info_lng + '</td></tr>');
            content.push('<tr><td>纬度:</td><td>' + targetobj.info_lat + '</td></tr>');
            content.push('<tr><td>时间:</td><td>' + targetobj.info_time + '</td></tr>');
            content.push('<tr><td>航向:</td><td>' + targetobj.info_dir + '</td></tr>');
            content.push('<tr><td>航艏向:</td><td>' + targetobj.info_heading + '</td></tr>');
            content.push('<tr><td>航速:</td><td>' + targetobj.info_speed + '</td></tr>');
            content.push('</table>');
            content = content.join("");
            return content;
        },

        getTooltipOptions: function() {
            return {
                offset: [0, 0],
                direction: 'top',
                permanent: false
            };
        },

        /*
         * latLng 要移到的坐标点
         * transitionTime 移到最新点经历的时间
         * timestamp 当前的时间点
         */
        moveMarker: function(latLng, transitionTime, timestamp) {
            if (this._marker) {

                var latlngold = this._marker.getLatLng();
                var tick = this.tick(timestamp);

                // this._marker.move(latLng, transitionTime);

                // this._marker.setIconAngle(tick.dir);

                if (transitionTime !== 0) {
                    //移动目标
                    this._marker.move(latLng, transitionTime);
                    this._marker.setIconAngle(tick.dir);

                    //绘制上一次到当前时间的历史轨迹线
                    var latlngs = [
                        [latlngold.lat, latlngold.lng],
                        [latLng.lat, latLng.lng]
                    ];
                    var polyline = L.polyline(latlngs, this.options.trackLineOptions);
                    // this._trackLineFeatureGroup.addLayer(polyline);

                    //绘制当前时间的轨迹点
                    var point = this.createTrackPoint(timestamp);
                    // this._trackPointFeatureGroup.addLayer(point); 

                    //添加轨迹线的时间应该在船舶移动后添加
                    var self = this;
                    (function(polyline, point, transitionTime) {
                        self._timeoutTicker = setTimeout(function() {
                            self._trackLineFeatureGroup.addLayer(polyline);
                            self._trackPointFeatureGroup.addLayer(point);
                        }, transitionTime);

                    })(polyline, point, transitionTime);

                } else {
                    this.clearTrackInfo();
                    //绘制从开始到当前时间的历史轨迹线
                    this.drawHistoryTrackLine(timestamp);
                    //绘制从开始到当前时间的历史轨迹点
                    this.drawHistoryTrackPoints(timestamp);
                }

            }
        },

        drawHistoryTrackLine: function(timestamp) {
            var latlngs = [];
            for (var i = 0, len = this._times.length; i < len; i++) {
                if (this._times[i] <= timestamp) {
                    var latlng = this.getLatLng(this._times[i]);
                    if (latlng) {
                        latlngs.push(latlng);
                    }
                }
            }
            var polylineHis = L.polyline(latlngs, this.options.trackLineOptions);
            this._trackLineFeatureGroup.addLayer(polylineHis);
        },

        drawHistoryTrackPoints: function(timestamp) {
            for (var i = 0, len = this._times.length; i < len; i++) {
                if (this._times[i] <= timestamp) {
                    var pt = this.createTrackPoint2(this._times[i]);
                    if (pt) {
                        this._trackPointFeatureGroup.addLayer(pt);
                    }
                }
            }
        },

        createTrackPoint2: function(timestamp) {
            var latlng = this.getLatLng(timestamp);
            if (latlng) var cricleMarker = L.circleMarker(latlng, this.options.OriginCircleOptions);
            var infoObj = this.tick(timestamp);
            if (infoObj) cricleMarker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions());
            //将最后一个点的信息绑定到船舶上
            if (!this._marker) {
                this.setMarker(timestamp, this.options);
                this._map.addLayer(this._marker);
            }
            if (this._marker) {
                this._marker.setLatLng(latlng);
                this._marker.setIconAngle(infoObj.dir);
                this._marker.unbindTooltip();
                this._marker.bindTooltip(this.getTooltipText(infoObj), this.getTooltipOptions());
            }
            return cricleMarker;
        },

        //清除历史轨迹
        clearTrackInfo: function() {
            try {
                this.removeMarker();
                if (this._timeoutTicker) {
                    clearTimeout(this._timeoutTicker);
                    this._timeoutTicker = null;
                }
                if (this._trackLineFeatureGroup) {
                    this._trackLineFeatureGroup.clearLayers();
                    // this._trackLineFeatureGroup = null;
                }
                if (this._trackPointFeatureGroup) {
                    this._trackPointFeatureGroup.clearLayers();
                    // this._trackPointFeatureGroup = null;
                }
            } catch (e) {
                console.log("tshf:clearlayer error");
            }
        }

    });

    L.Playback.TrackController = L.Class.extend({

        initialize: function(map, tracks, options) {
            this.options = options || {};

            this._map = map;

            this._tracks = [];

            // initialize tick points
            this.setTracks(tracks);
        },

        clearTracks: function() {
            while (this._tracks.length > 0) {
                var track = this._tracks.pop();
                // var marker = track.getMarker();

                // if (marker) {
                //     this._map.removeLayer(marker);
                // }

                track.clearTrackInfo();
            }
        },

        clearAllTrack: function() {
            for (var i = 0, len = this._tracks.length; i < len; i++) {
                var track = this._tracks[i];
                track.clearTrackInfo();
            }
        },

        setTracks: function(tracks) {
            // reset current tracks
            this.clearTracks();

            this.addTracks(tracks);
        },

        addTracks: function(tracks) {
            // return if nothing is set
            if (!tracks) {
                return;
            }

            if (tracks instanceof Array) {
                for (var i = 0, len = tracks.length; i < len; i++) {
                    this.addTrack(tracks[i]);
                }
            } else {
                this.addTrack(tracks);
            }
        },

        // add single track
        addTrack: function(track, timestamp) {
            // return if nothing is set
            if (!track) {
                return;
            }

            // var marker = track.setMarker(timestamp, this.options);

            // if (marker) {
            //     marker.addTo(this._map);
            //     //定位到track所在位置 
            //     this._map.panTo(marker.getLatLng());

            this._tracks.push(track);
            // }
        },

        tock: function(timestamp, transitionTime, lasttime) {
            // for (var i = 0, len = this._tracks.length; i < len; i++) {
            //     var latLng = this._tracks[i].getLatLng(timestamp);
            //     if (transitionTime === 0 || latLng) {
            //         this._tracks[i].moveMarker(latLng, transitionTime, timestamp);
            //     }
            // }

            for (var i = 0, len = this._tracks.length; i < len; i++) {
                var track = this._tracks[i];
                var latLng = track.getLatLng(timestamp);
                if (track.tick(lasttime) && !track.getMarker()) {
                    var marker = track.setMarker(lasttime, this.options);
                    if (marker) {
                        this._map.addLayer(marker);
                        track.moveMarker(marker.getLatLng(), 0, lasttime);
                        // this._map.panTo(marker.getLatLng());
                    }
                }
                if (transitionTime === 0 || latLng) {
                    track.moveMarker(latLng, transitionTime, timestamp);
                }
            }
        },
        
        locateToMarker:function(timestamp){
            for (var i = 0, len = this._tracks.length; i < len; i++) {
                var track = this._tracks[i];
                var latLng = track.getLatLng(timestamp);
                if(latLng){
                    this._map.panTo(latLng);
                    break;
                }
            }            
        },

        getStartTime: function() {
            var earliestTime = 0;

            if (this._tracks.length > 0) {
                earliestTime = this._tracks[0].getStartTime();
                for (var i = 1, len = this._tracks.length; i < len; i++) {
                    var t = this._tracks[i].getStartTime();
                    if (t < earliestTime) {
                        earliestTime = t;
                    }
                }
            }

            return earliestTime;
        },

        getEndTime: function() {
            var latestTime = 0;

            if (this._tracks.length > 0) {
                latestTime = this._tracks[0].getEndTime();
                for (var i = 1, len = this._tracks.length; i < len; i++) {
                    var t = this._tracks[i].getEndTime();
                    if (t > latestTime) {
                        latestTime = t;
                    }
                }
            }

            return latestTime;
        },

        getAllTimes: function() {

            var alltimes = [];
            //concat
            if (this._tracks.length > 0) {
                for (var i = 0, len = this._tracks.length; i < len; i++) {
                    var timesi = this._tracks[i].getTimes();
                    alltimes = alltimes.concat(timesi);
                }
            }
            //unique 
            alltimes = this.uniqueArr(alltimes);
            //sort
            for (var i = 0, leni = alltimes.length; i < leni - 1; i++) {
                for (var j = 0; j < leni - 1 - i; j++) {
                    if (alltimes[j] > alltimes[j + 1]) {
                        var temp = alltimes[j];
                        alltimes[j] = alltimes[j + 1];
                        alltimes[j + 1] = temp;
                    }
                }
            }

            return alltimes;
        },

        uniqueArr: function(arr) {
            var temp = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (temp.indexOf(arr[i]) === -1) {
                    temp.push(arr[i]);
                }
            }
            return temp;
        },

        getTracks: function() {
            return this._tracks;
        }

    });

    L.Playback.Clock = L.Class.extend({

        initialize: function(trackController, callback, options) {
            this._trackController = trackController;
            this._callbacksArry = [];
            if (callback) this.addCallback(callback);
            L.setOptions(this, options);

            this._speed = this.options.speed;
            this.max_speed = this.options.Max_Speed;
            this._alltime = this._trackController.getAllTimes();
            this._cursor = this._trackController.getStartTime();
            this._trackController.locateToMarker(this._cursor);
            if (this._alltime.length) { //规定n分钟内播放完，除以时间点个数得到每一次变化的时间
                this._tickLen = 5 * 60 * 1000 / this._alltime.length;
            }
            // this._transitionTime = this.getTransitionTime();  //this._tickLen / this._speed;        
        },

        _tick: function(transtitionTime) {
            //旧版
            // if (self._cursor > self.getEndTime()) {
            //     clearInterval(self._intervalID);
            //     self._intervalID = null; //Linghuam add 播放停止后，再开始无法播放问题
            //     return;
            // }        
            // self._trackController.tock(self._cursor, self._transitionTime);
            // self._callbacks(self._cursor);
            // self._cursor = self.getNextTime();
            var lasttime = this._cursor;
            this._cursor = this.getNextTime();
            if (!this._cursor || this._cursor > this.getEndTime()) {
                clearTimeout(this._intervalID);
                this._intervalID = null; //Linghuam add 播放停止后，再开始无法播放问题
                return;
            }
            this._trackController.tock(this._cursor, transtitionTime, lasttime);
            this._callbacks(this._cursor);
        },

        _callbacks: function(cursor) {
            var arry = this._callbacksArry;
            for (var i = 0, len = arry.length; i < len; i++) {
                arry[i](cursor);
            }
        },

        addCallback: function(fn) {
            this._callbacksArry.push(fn);
        },

        //根据相邻两点之间的真实时间间隔设置动画时间
        getTransitionTime: function() {
            var t1 = this._cursor;
            var t2 = this.getNextTime();
            var transitionTime = this._tickLen / this._speed; //设置一个默认值
            if (t1 && t2 && t2 > t1) {
                transitionTime = (t2 - t1) / this._speed;
            }
            return transitionTime;
        },

        start: function() {
            //旧版
            // if (this._intervalID) return;
            // this._intervalID = window.setInterval(
            //   this._tick, 
            //   this._transitionTime, 
            //   this);

            if (this._intervalID) return;
            this._intervalID = true;
            var self = this;
            (function loop() {
                if (!self._intervalID) { //播放暂停切换时停止播放
                    return;
                }
                var transtitionTime = self.getTransitionTime();
                clearTimeout(self._intervalID);
                self._intervalID = setTimeout(function() {
                    self._tick(transtitionTime);
                    loop();
                }, transtitionTime);
            })();
        },

        stop: function() {
            if (!this._intervalID) return;
            clearTimeout(this._intervalID);
            this._intervalID = null;
        },

        getSpeed: function() {
            return this._speed;
        },

        isPlaying: function() {
            return this._intervalID ? true : false;
        },

        setSpeed: function(speed) {
            this._speed = speed;
            if (this._intervalID) {
                this.stop();
                this.start();
            }
        },

        //加速
        quickSpeed: function() {
            this._speed = this._speed >= this.max_speed ? this._speed : this._speed * 2;
            if (this._intervalID) {
                this.stop();
                this.start();
            }
        },

        //减速
        slowSpeed: function() {
            this._speed = this._speed <= 1 ? this._speed : this._speed / 2;
            if (this._intervalID) {
                this.stop();
                this.start();
            }
        },

        //重新播放
        rePlaying: function() {
            this._trackController.clearAllTrack();
            if (this.isPlaying()) {
                this.stop();
            }
            this.setCursor(this.getStartTime());
            this.start();
        },

        setCursor: function(ms) {
            var time = this.getValidCursor(ms);
            if (time) {
                this._cursor = time;
                this._trackController.tock(this._cursor, 0, time);
            }
            this._callbacks(ms);
        },

        getValidCursor: function(time) {
            var curtime;
            if (time <= this.getEndTime() && time >= this.getStartTime()) {
                curtime = time;
                for (var i = 0, len = this._alltime.length; i < len; i++) {
                    if (this._alltime[i] > curtime) {
                        curtime = this._alltime[i-1];
                        break;
                    }
                }
            }
            return curtime;
        },

        getTime: function() {
            return this._cursor;
        },

        getAllTime: function() {
            return this._alltime;
        },

        getStartTime: function() {
            return this._trackController.getStartTime();
        },

        getEndTime: function() {
            return this._trackController.getEndTime();
        },

        getLastTime: function() {
            var lasttime;
            var index = this._alltime.indexOf(this._cursor);
            if (index !== -1 && index !== 0) {
                lasttime = this._alltime[index - 1];
            }
            return lasttime;
            // if(index === -1) return this._alltime[0];
            // else if(index === 0) return this._alltime[this._alltime.length-1];
            // else return this._alltime[index-1];
        },

        getNextTime: function() {
            var nexttime;
            var index = this._alltime.indexOf(this._cursor);
            if (index !== -1 && index !== this._alltime.length - 1) {
                nexttime = this._alltime[index + 1];
            }
            return nexttime;
            // if(index === -1) return this._alltime[this._alltime.length-1];
            // else if(index === this._alltime.length-1) this.stop();
            // else return this._alltime[index+1];
        },

        getTickLen: function() {
            return this._tickLen;
        }

    });

}));
