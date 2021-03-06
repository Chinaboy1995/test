import L from 'leaflet'
import { CanvasLayer } from './leaflet.canvaslayer.js'

export var Draw = L.Class.extend({

    shipOptions: {
        useImg: false,
        imgUrl: '../../static/images/ship.png',
        width: 8,
        height: 18,
        color: '#00f', // stroke color
        fillColor: '#9FD12D'
    },

    toolTipOptions: {
        offset: [0, -14],
        direction: 'top',
        permanent: false
    },

    iconOptions: {
        iconSize: [20, 20],
        iconAnchor: [12, 12],
        className: 'ict_markerselect_divicon'
    },

    initialize: function (map, realtargetInstance, options = {}) {

        this.shipOptions = L.extend(this.shipOptions, options.shipOptions);
        this.toolTipOptions = L.extend(this.toolTipOptions, options.toolTipOptions);

        this._map = map;
        this._canvasLayer = new CanvasLayer().addTo(map);
        this._canvas = this._canvasLayer.getContainer();
        this._ctx = this._canvas.getContext('2d');

        this._realtargetInstance = realtargetInstance;
        this._clickRadius = 5;
        this._selectMarker = null;
        this._hidediv = null;

        this._lastFpsUpdateTime = 0;

        this._canvasLayer.on('update', this._shipLayerUpdate, this);
        this._map.on('click', this._onMouseClickEvt, this);
        this._map.on('contextmenu', this._onContextClickEvt, this);
        this._map.on('mousemove', this._onMouseMoveEvt, this);

        this._initContextMenu();
    },

    drawShips: function (data, drawEndCallback) {
        var timestamp = this._caculatefpsTime(+new Date());
        // if (timestamp === 0 || timestamp >= 1000) {
        this._clearLayer();
        this._drawShips(data);
        drawEndCallback();
        // }
    },

    update: function () {
        this._shipLayerUpdate();
    },

    removeLayer: function () {
        if(this._map.hasLayer(this._canvasLayer)) {
            this._map.removeLayer(this._canvasLayer);
        }
    },

    clear: function () {
        this._clearLayer();
    },

    // 计算两帧时间间隔，单位：毫秒
    _caculatefpsTime: function (now) {
        var time = now - this._lastFpsUpdateTime;
        if(this._lastFpsUpdateTime === 0) {
            time = 0;
        }
        this._lastFpsUpdateTime = now;
        return time;
    },

    _getShipColorByType: function (type) {
        var color = '#FFD800';
        switch(type) {
        case 1:
            color = '#EC1411';
            break;
        case 2:
            color = '#F56C11';
            break;
        case 3:
            color = '#EE2EFF';
            break;
            // case 4 : color = '#1F84FF'; break;
        case 5:
            color = '#36CDFF';
            break;
        case 6:
            color = '#1F84FF';
            break;
        case 7:
            color = '#00EBC2';
            break;
        case 8:
            color = '#74EB0B';
            break;
            // case 9 : color = '#f0f'; break;
            // case 10 : color = '#f0f'; break;
            // case 11 : color = '#f0f'; break;
        }
        return color;
    },

    _shipLayerUpdate: function () {
        if(this._realtargetInstance._alltargets.length) {
            this._clearLayer()
            this._drawShips(this._realtargetInstance._alltargets)
        }
    },

    _onMouseClickEvt: function (e) {
        var target = this._getTriggerTarget(e.layerPoint);
        if(target) {
            let latlng = L.latLng(target.lat, target.lng);
            this._removeSelectMarker();
            this._addSelectMarker(latlng);
            this._opentoolTip(target);
            this._realtargetInstance.updateSelectState(target);
        }
    },

    _onContextClickEvt: function (e) {
        var target = this._getTriggerTarget(e.layerPoint);
        this._removeHideDiv();
        if(target) {
            let latlng = L.latLng(target.lat, target.lng);
            this._addHideDiv(latlng);
            var mapcontainer = this._map.getContainer();
            var x = e.containerPoint.x + mapcontainer.offsetLeft;
            var y = e.containerPoint.y + mapcontainer.offsetTop;
            $('#leaflet-map').contextMenu(false);
            $('.leaflet-marker-rightclick-icon').contextMenu(true);
            $('.leaflet-marker-rightclick-icon').contextMenu({ x: x, y: y });
        }
    },

    _onMouseMoveEvt: function (e) {
        var target = this._getTriggerTarget(e.layerPoint);
        if(target) {
            this._canvas.style.cursor = 'default';
        } else {
            this._canvas.style.cursor = 'pointer'
        }
    },

    _initContextMenu: function () {
        $.contextMenu({
            selector: '.leaflet-marker-rightclick-icon', // 选择右键菜单触发的元素
            trigger: 'none',
            callback: function (key, options) {
                this._rightClickCallback(key, options)
            }.bind(this),
            items: {
                'bpxs': {
                    'name': '标牌显示',
                    'items': {
                        'bpxs-shipname': { 'name': '船名' },
                        'bpxs-ph': { 'name': '批号' },
                        'bpxs-all': { 'name': '目标信息' }, // test
                        'bpxs-close': { 'name': '关闭显示' }
                    }
                },
                'hjxs': { 'name': '航迹显示' },
                'xskz': {
                    'name': '显示控制',
                    'items': {
                        'xskz-key1': { 'name': '全航迹' },
                        'xskz-key2': { 'name': '10点' },
                        'xskz-key3': { 'name': '100点' },
                        'xskz-key4': { 'name': '1000点' }
                    }
                },
                'tshf': { 'name': '态势回放' },
                'addhf': { 'name': '加入回放列表' },
                'mbkc': { 'name': '目标开窗' }
                // "qykc": { "name": "区域开窗" }
            }
        })
    },

    _rightClickCallback: function (key, options) {
        var curtarget = this.currentTarget
        var curobj = curtarget.options.data
        if(key === 'bpxs-shipname') {
            var shipname = curobj.shipname
            curtarget.unbindTooltip()
            curtarget.bindTooltip(shipname, this.getTootipOptions())
            curtarget.openTooltip()
        } else if(key === 'bpxs-ph') {
            var ph = curobj.id.toString()
            curtarget.unbindTooltip()
            curtarget.bindTooltip(ph, this.getTootipOptions())
            curtarget.openTooltip()
        } else if(key === 'bpxs-all') { // 目标信息显示标签
            var info = this.getTargetDyInfo(curobj)
            curtarget.unbindTooltip()
            curtarget.bindTooltip(info, this.getTootipOptions())
            curtarget.openTooltip()
            curtarget.off('move', this._tipmove, this)
            curtarget.off('tooltipclose', this._tipclose, this)
            curtarget.on('move', this._tipmove, this)
            curtarget.on('tooltipclose', this._tipclose, this)
        } else if(key === 'bpxs-close') {
            curtarget.unbindTooltip()
        } else if(key === 'hjxs') {
            var hjxsObj = L.ICT.Func['HJCX_HJXS'].getInstance()
            hjxsObj.start()
        } else if(key === 'xskz-key1') {
            var xskzObj = L.ICT.Func['HJCX_HJKZ'].getInstance()
            xskzObj.start(0)
        } else if(key === 'xskz-key2') {
            var xskzObj = L.ICT.Func['HJCX_HJKZ'].getInstance()
            xskzObj.start(10)
        } else if(key === 'xskz-key3') {
            var xskzObj = L.ICT.Func['HJCX_HJKZ'].getInstance()
            xskzObj.start(100)
        } else if(key === 'xskz-key4') {
            var xskzObj = L.ICT.Func['HJCX_HJKZ'].getInstance()
            xskzObj.start(1000)
        } else if(key === 'tshf') {
            L.ICT.Func['TSHFOneShip'].run()
        } else if(key === 'addhf') {
            var tshfinstance = L.ICT.Func['TSHFMoreShip'].getInstance()
            tshfinstance.addTarget(curobj)
            if(tshfinstance._targetPanel) {
                tshfinstance.updateList()
            } else {
                L.ict.app.util.dialog.success('提示', '成功加入回放列表！')
            }
        } else if(key === 'mbkc') { // 目标开窗
            this.openWindowTarget(curobj)
        }
        // else if(key === 'qykc'){
        //     this.openWindowArea(curobj);//区域开窗
        // }
    },

    _getTriggerTarget: function (point) {
        if(this._realtargetInstance._alltargets.length) {
            for(let i = 0, len = this._realtargetInstance._alltargets.length; i < len; i++) {
                let tpoint = this._map.latLngToLayerPoint(L.latLng(this._realtargetInstance._alltargets[i].lat, this._realtargetInstance._alltargets[i].lng))
                if(point.distanceTo(tpoint) <= this._clickRadius) {
                    return this._realtargetInstance._alltargets[i];
                }
            }
        }
    },

    _opentoolTip: function (shipobj) {
        if(this._map.hasLayer(this._tooltip)) {
            this._map.removeLayer(this._tooltip)
        }
        this._canvas.style.cursor = 'default'
        var latlng = L.latLng(shipobj.lat, shipobj.lng)
        var tooltip = this._tooltip = L.tooltip(this.toolTipOptions)
        tooltip.setLatLng(latlng)
        tooltip.addTo(this._map)
        tooltip.setContent(this._getTooltipText(shipobj))
    },

    _drawShips: function (data) {
        // 画船
        for(let i = 0, len = data.length; i < len; i++) {
            if(this.shipOptions.useImg) {
                this._drawShip2(data[i]);
            } else {
                this._drawShip(data[i]);
            }
            this._drawSelect(data[i]);
        }
    },

    _drawSelect: function (shipobj) {
        if(shipobj.eventTag.isSelect) {
            let latlng = L.latLng(shipobj.lat, shipobj.lng);
            this._removeSelectMarker();
            this._addSelectMarker(latlng);
        }
    },

    _removeHideDiv: function () {
        if(this._map.hasLayer(this._hidediv)) {
            this._map.removeLayer(this._hidediv);
        }
    },

    _addHideDiv: function (latlng) {
        this._hidediv = L.marker(latlng, {
            icon: L.divIcon({
                className: 'leaflet-marker-rightclick-icon'
            })
        });
        this._map.addLayer(this._hidediv);
    },

    _addSelectMarker: function (latlng) {
        this._selectMarker = L.marker(latlng, { icon: L.divIcon(this.iconOptions) }).addTo(this._map);
    },

    _removeSelectMarker: function () {
        if(this._map.hasLayer(this._selectMarker)) {
            this._map.removeLayer(this._selectMarker);
        }
    },

    _drawShip: function (shipobj) {
        var point = this._map.latLngToLayerPoint(L.latLng(shipobj.lat, shipobj.lng))
        var rotate = shipobj.dir || 0
        var w = this.shipOptions.width
        var h = this.shipOptions.height
        var dh = h / 3

        this._ctx.save()
        this._ctx.fillStyle = this._getShipColorByType(shipobj.originalObj.st);
        this._ctx.strokeStyle = this.shipOptions.color
        this._ctx.translate(point.x, point.y)
        this._ctx.rotate((Math.PI / 180) * rotate)
        this._ctx.beginPath()
        this._ctx.moveTo(0, 0 - h / 2)
        this._ctx.lineTo(0 - w / 2, 0 - h / 2 + dh)
        this._ctx.lineTo(0 - w / 2, 0 + h / 2)
        this._ctx.lineTo(0 + w / 2, 0 + h / 2)
        this._ctx.lineTo(0 + w / 2, 0 - h / 2 + dh)
        this._ctx.closePath()
        this._ctx.fill()
        this._ctx.stroke()
        this._ctx.restore()
    },

    _drawShip2: function (shipobj) {
        var point = this._map.latLngToLayerPoint(L.latLng(shipobj.lat, shipobj.lng))
        var dir = shipobj.dir || 0
        var width = this.shipOptions.width
        var height = this.shipOptions.height
        var offset = {
            x: width / 2,
            y: height / 2
        }
        var img = new Image()
        img.onload = function () {
            this._ctx.save()
            this._ctx.translate(point.x, point.y)
            this._ctx.rotate((Math.PI / 180) * dir)
            this._ctx.drawImage(img, 0 - offset.x, 0 - offset.y, width, height)
            this._ctx.restore()
        }.bind(this)
        img.src = this.shipOptions.imgUrl
    },

    _drawDashRect: function (point, width, height) {
        this._ctx.save();
        this._ctx.setLineDash([6]);
        this._ctx.strokeStyle = '#f00';
        this._ctx.lineWidth = 4;
        this._ctx.strokeRect(point.x - width / 2, point.y - height / 2, width, height);
        this._ctx.restore();
    },

    _getTooltipText: function (targetobj) {
        targetobj.info = [
            { key: 'id', value: targetobj.id },
            { key: '船名', value: targetobj.shipname },
            { key: '经度', value: targetobj.lng },
            { key: '纬度', value: targetobj.lat },
            { key: '类型', value: targetobj.shiptype }
        ];
        var content = [];
        content.push('<table>');
        if(targetobj.info && targetobj.info.length) {
            for(let i = 0, len = targetobj.info.length; i < len; i++) {
                content.push('<tr>')
                content.push('<td>' + targetobj.info[i].key + '</td>')
                content.push('<td>' + targetobj.info[i].value + '</td>')
                content.push('</tr>')
            }
        }
        content.push('</table>');
        content = content.join('');
        return content;
    },

    _clearLayer: function () {
        var bounds = this._canvasLayer.getBounds()
        if(bounds) {
            var size = bounds.getSize();
            this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
        } else {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
        this._removeHideDiv();
        this._removeSelectMarker();
    }

})

export var draw = function (map, options) {
    return new Draw(map, options)
}
