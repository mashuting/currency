(function(angular, moment, sprintf){
    'use strict';

    angular.module('currency.services', ["ngLodash"])
        .constant('moment', moment)
        .constant('sprintf', sprintf)
        .constant('CapacityUnits', CapacityUnits())
        .factory('Toolkit', Toolkit)
        .factory("AuthInterceptor", AuthInterceptor)
        .factory('settings', metronicSettings)
        .factory('ValidationTool', ValidationTool)
        .factory('CheckboxGroup', CheckboxGroup)
        .factory('DatePicker', DatePicker)
        .factory('ngTableHelper', ngTableHelper)
        .factory('timeService', timeService)
        .factory('ServiceHelper', ServiceHelper)
        .factory('QuotaHelper', QuotaHelper)
        .filter("humanizeTime", humanizeTime)
        .factory("AlertTriggerHelper", AlertTriggerHelper);

    function Toolkit(ValidationTool, ngTableHelper, $ngBootbox, lodash, timeService) {

        var toastr = ToastrService();
        return {
            validate: ValidationTool.init,
            pagination: ngTableHelper,
            table: ngTableHelper,
            toastr: toastr,
            time: timeService,
            isEmpty: isEmpty,
            sprintf: sprintf,
            bootbox: $ngBootbox,
            humanizeDiskSize: humanizeDiskSize,
            generalErrorHandle: generalErrorHandle
        };

        function isEmpty(value) {
            if (value == null || value == undefined) {
                return true;
            }

            if (typeof value == 'string') {
                return /^\s*$/.test(value);
            }

            if (angular.isArray(value)) {
                return value.length == 0;
            }

            return lodash.keys(value).length == 0;
        }

        function generalErrorHandle(resp) {
            toastr.error(resp.data.message);
        }
    }
    
    function CapacityUnits() {
        var BYTES = 1;
        var KB = 1024;
        var MB = 1024 * KB;
        var GB = 1024 * MB;
        var TB = 1024 * GB;
        var PB = 1024 * TB;
        
        return {
            BYTES: BYTES,
            KB: KB,
            MB: MB,
            GB: GB,
            TB: TB,
            PB: PB
        }
    }

    function humanizeDiskSize(size, precision){
        precision = precision || 0; 
        var units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

        for(var i = 0; i < units.length; i++){
            if(size < 1024){
                return "" + size.toFixed(precision) + units[i];
            } else {
                size /= 1024;
            }
        }
    }

    function ToastrService() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        return {
            success: function (message, title) {
                title = title || "成功";
                toastr.success(message, title);
            },
            warning: function (message, title) {
                title = title || "警告";
                toastr.warning(message, title);
            },
            error: function (message, title) {
                title = title || "错误";
                toastr.error(message, title);
            }
        };

    }

    function AuthInterceptor($q, site_config){
        return {
            'responseError': function(rejection){
                if (rejection.status == 403 || rejection.status == 401) {
                    window.location.href = site_config.LOGIN_URL;
                    return $q.reject(rejection);
                }
                return $q.reject(rejection);
            }
        }
    }

    function metronicSettings($rootScope){
        Metronic.setAssetsPath("/static/assets/");
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
            layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
        };
        $rootScope.settings = settings;

        return settings;
    }

    function ValidationTool(){

        var defaultConfig = {
            onkeyup: false,
            doNotHideMessage: true,
            errorElement: 'span',
            errorClass: 'help-block help-block-error',
            focusInvalid: false,
            errorPlacement: function (error, element) {
                //element.parent().append(error);
                var p = element.parent();
                if(p && p.hasClass("input-group")){
                    p = p.parent();
                }
                p.append(error);
            },

            highlight: function (element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            },

            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            }
        };

        return {
            init: function(selector, config){
                config = config || {};
                for(var attr in defaultConfig){
                    if(config[attr] === undefined){
                        config[attr] = defaultConfig[attr];
                    }
                }
                $(selector).validate(config);

                return $(selector);
            },
            addValidator: $.validator.addMethod
        }
    }

    function CheckboxGroup(){

        var init = function(objects, flagName){

            flagName = flagName || 'checked';

            var groupChecker = {
                objects: objects,
                toggleAll: function(){
                    var self = this;
                    angular.forEach(self.objects, function(obj){
                        obj[flagName] = self[flagName];
                    });
                },
                noneChecked: function(){
                    var count = 0;

                    angular.forEach(this.objects, function(obj){
                        if(obj[flagName]){
                            count += 1;
                        }
                    });

                    return count == 0;
                },
                syncObjects: function(objects){
                    this.objects = objects;
                },
                uncheck: function(){
                    this[flagName] = false;
                    this.toggleAll();
                },
                forEachChecked: function(func){
                    angular.forEach(this.objects, function(obj){
                        if(obj[flagName]){
                           func(obj);
                        }
                    });
                },
                checkedObjects: function(){
                    var results = [];
                    this.forEachChecked(function(obj){
                        results.push(obj);
                    });
                    return results;
                }
            };

            groupChecker[flagName] = false;

            return groupChecker;
        };

        return {init: init};

    }

    function DatePicker(){

        /* Init date pickers, more functions come later. */
        var initDatePickers = function(selector){

            selector = selector || '.date-picker';
            if (jQuery().datepicker) {
                $(selector).datepicker({
                    rtl: Metronic.isRTL(),
                    orientation: "left",
                    format: 'yyyy-mm-dd',
                    autoclose: true
                });
            }
        };

        var initDateTimePickers = function(config){

            config = config || {};

            var defaultConfig = {
                autoclose: true,
                isRTL: Metronic.isRTL(),
                pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left"),
                format: "yyyy-mm-dd hh:ii",
                todayBtn: true,
                minuteStep: 10
            };

            angular.extend(defaultConfig, config);

            $(".form_datetime").datetimepicker(defaultConfig);
        };

        return {
            initDatePickers: initDatePickers,
            initDateTimePickers: initDateTimePickers
        }
    }

    function ngTableHelper(ngTableParams){

        return {
            create: create,
            countPages: countPages,
            paginate: paginate,
            receiveData: receiveData,
            extend: extendTable
        };

        function paginate(data, $defer, params){

            if(!angular.isArray(data)){
               return data;
            }

            countPages(params, data.length);

            var start = (params.page() - 1) * params.count(),
                end = params.page() * params.count(),
                partial = data.slice(start, end);

            $defer.resolve(partial);

            return partial;
        }

        function countPages(params, total){

            params.total(total);

            var pageNum = Math.ceil(total / params.count());

            if(pageNum == 0){
                pageNum = 1;
            }

            if(pageNum < params.page()){
                params.page(pageNum);
            }
        }

        function receiveData(data, $defer, params){

            if(angular.isArray(data)){
                paginate(data, $defer, params);
            }

            if(angular.isObject(data)){
                $defer.resolve(data.results);
                countPages(params, data.count);
            }
        }

        function extendTable(table, conditionFunc){

            table.ext = {
                query: search,
                keypress: keypress,
                getParams: searchParams
            };

            function search(){
                table.page(1);
                table.reload();
            }

            function keypress($event){
                if($event.keyCode == 13){
                    $event.preventDefault();
                    search();
                }
            }

            function searchParams(params){
                var result = {
                    page: params.page(),
                    page_size: params.count()
                };

                var condition = conditionFunc;

                if(angular.isFunction(condition)){
                    condition = condition();
                }

                angular.extend(result, condition);

                return result;
            }
            
            return table;
        }
        
        function create(config){
            
            var Resource = config.resource; 
            var condition = config.condition;
            var beforeLoad = config.beforeLoad;
            var callback = config.callback;
            var method = config.method || 'query';
            var query = Resource[method];
            
            var table = new ngTableParams({
                page: 1,
                count: 10
            }, {
                counts: [],
                getData: function ($defer, params) {
                
                    if(beforeLoad){
                        beforeLoad();
                    }
                    
                    var searchParams = table.ext.getParams(params);
                     
                    query(searchParams, function (data) {
                        receiveData(data, $defer, params);
                        if(callback) {
                            data.results.forEach(callback)
                        }                            
                    });
                }
            });
            
            return extendTable(table, condition);
        }
    }

    var SECOND = 1000,
        MINUTE = 60 * SECOND,
        HOUR = 60 * MINUTE,
        DAY = 24 * HOUR,
        WEEK = 7 * DAY,
        MONTH = 30 * WEEK,
        YEAR = 365 * DAY,
        UNITS = [
            {value: YEAR, label: 'y', label_cn: '年'},
            {value: MONTH, label: 'M', label_cn: "月"},
            {value: WEEK, label: 'w', label_cn: "周"},
            {value: DAY, label: 'd', label_cn: "天"},
            {value: HOUR, label: 'h', label_cn: "时"},
            {value: MINUTE, label: 'm', label_cn: "分"},
            {value: SECOND, label: 's', label_cn: "秒"}
        ];

    function humanizeTime(){
        return function(time){
            var unit = null,
            result = '';

            for(var i=0; i < UNITS.length; i++){
                unit = UNITS[i];

                if(time >= unit.value){
                    result += Math.round(time / unit.value) + unit.label_cn
                    time = time % unit.value
                }
            }
            return result;
        };
    }

    function timeService(){

        return {
            computeInterval: computeInterval,
            humanize: humanize
        };

        function computeInterval(start, end, num){

            start = moment(start).valueOf();
            end = moment(end).valueOf();

            var duration = Math.abs(end - start),
                interval = duration / num;

            var unit = null;
            for(var i=0; i < UNITS.length; i++){
                unit = UNITS[i];
                if(interval > unit.value){
                    interval = Math.round(interval / unit.value);
                    break;
                }
            }

            if(interval > 10){
                interval = Math.round(interval/10.0) * 10;
            }
            return interval + unit.label;
        }

        function humanize(time){
            var unit = null,
            result = '';

            for(var i=0; i < UNITS.length; i++){
                unit = UNITS[i];

                if(time >= unit.value){
                    result += Math.round(time / unit.value) + unit.label_cn
                    time = time % unit.value
                }
            }
            return result;
        }
    }
    
    
    function QuotaHelper(){
        
        return {
            barType: barType,
            cpuBar: cpuBar,
            memBar: memBar,
            volumeBar: volumeBar
        };
        
        function cpuBar(quota, cpu, num){
            var cpuUsed = ((cpu * num) + quota.cpu_used).toFixed(1);
            return progressBarConfig(cpuUsed, quota.cpu); 
        }

        function memBar(quota, mem, num){
            var memUsed = mem * num + quota.memory_used;
            return progressBarConfig(memUsed, quota.memory);
        }

        function volumeBar(quota, capacity){
            var used = capacity + quota.volume_used;
            return progressBarConfig(used, quota.volume);
        }

        function progressBarConfig(resourceUsed, resourceLimit) {
            var ratio  = parseFloat((resourceUsed * 100 / resourceLimit).toFixed(0));
            return {
                used: resourceUsed,
                limit: resourceLimit,
                value: ratio,
                type: barType(ratio)
            }     
        }
        
        function barType(value){
            var type = "success";

            if(value >= 50 && value <= 90) {
                type = "info";
            } else if(value > 90 && value <= 100) {
                type = "warning";
            } else if(value > 100 ) {
                type = "danger";
            }
            
            return type;
        }
    }
    
    function ServiceHelper($timeout, moment, lodash, CapacityUnits, ServiceStatus, InstanceStatus) {

        var DATABASE_MODES = {
            "single": "单例",
            "master-slave": "主从",
            "master-master": "主主"
        };

        return {
            DATABASE_MODES: DATABASE_MODES,
            mergeStatus: mergeStatus,
            normalizeStatus: noramlizeStatus,
            createPendingObjects: createPendingObjects,
            textifyFlavor: textifyFlavor,
            textifyFlavors: textifyFlavors,
            addUnderQuotaValidation: addUnderQuotaValidation,
            addMountVolumesValidation: addMountVolumesValidation,
        };

        function mergeStatus(service, status) {
            angular.extend(service, status);
            ServiceStatus.process(service);
            service.external_ip = status.service_ip;
            service.instances = service.instances || [];
            service.instances.forEach(function (instance) {
                InstanceStatus.process(instance);
                instance.start_time = moment(instance.start_time).format("YYYY-MM-DD HH:mm:ss");
            });
        }

        function textifyFlavors(flavors) {
            flavors.forEach(textifyFlavor);
            return flavors;
        }

        function textifyFlavor(flavor) {
            var memory = humanizeDiskSize(flavor.memory * CapacityUnits.MB);
            flavor.text = sprintf("%f CPU %s 内存", flavor.cpu, memory);
            return flavor;
        }

        function noramlizeStatus(service) {
            ServiceStatus.process(service);
        }

        function createPendingObjects() {
            return new PendingObjects();
        }

        function PendingObjects() {
            /**
             * PendingObjects　主要用来管理需要被清除的timeout
             */

            var self = this;
            var objects = {};

            self.register = function (key, delay, func, canContinue) {
                /**
                 * register 注册需要管理的timeout
                 *
                 * canContinue用来判断是否继续timeout
                 * @type {{func: *, canContinue: *, delay: *, timeout: *}}
                 */
                objects[key] = {
                    func: func,
                    canContinue: canContinue,
                    delay: delay,
                    timeout: $timeout(func, 0),
                };
            };

            self.clear = function (key) {
                var entry = objects[key] || null;

                if (entry == null) {
                    return;
                }

                $timeout.cancel(entry.timeout);
                delete objects[key];
            };

            self.clearAll = function () {
                lodash.each(objects, function (entry) {
                    $timeout.cancel(entry.timeout);
                });
                objects = {};
            };

            self.makeToken = function (key) {
                /**
                 * 生成的token用来判断是否还能生成下一个timeout
                 */
                var entry = objects[key];
                entry.token = Math.random();
                return entry.token;
            };

            self.clearOrContinue = function (key, token) {

                var entry = objects[key] || null;

                if (entry == null || entry.token != token) {
                    return;
                }

                if (entry.canContinue()) {
                    entry.timeout = $timeout(entry.func, entry.delay);
                } else {
                    self.clear(key);
                }
            };
        }

        function addUnderQuotaValidation(getNum, flavor, quota){
            var getFlavor = flavor;
            if(!angular.isFunction(getFlavor)) {
                getFlavor = function(){return flavor;} 
            }
            
            $.validator.addMethod('underQuota', function(values, element){
                var num = getNum();
                var flavor = getFlavor();
                var cpuUsed = num * flavor.cpu + quota.cpu_used;
                var memUsed = num * flavor.memory + quota.memory_used;
                
                return  cpuUsed <= quota.cpu && memUsed <= quota.memory;
            }, "配额不足");
        }

        function addMountVolumesValidation(num) {
            var getNum = num;
            if(!angular.isFunction(num)) {
                getNum = function(){
                    return num;
                };
            }
            
            $.validator.addMethod('enough-volumes', function (value, element) {
                return value.length == getNum();
            }, "请为每一个实例选择一个卷");
            
            $.validator.addMethod('unique-volume', function (values, element) {
                // 验证逻辑复杂, 具体流程是：
                // 获取所有volume相关的被选择option，提取出文本，然后计数，如果有一个文本的选择次数大于2说明被重复选择
                var selectedVolumes = [];

                $("select[name^=volume] option:selected").each(function (i, e) {
                    selectedVolumes.push($(e).text());
                });

                return lodash.chain(selectedVolumes).groupBy(function (name) {
                        return name;
                    }).values().filter(function (arr) {
                        return arr.length > 2;
                    }).value() == 0;

            }, "卷冲突，有一个卷被多个挂载点使用。");
        }
    }

    function AlertTriggerHelper() {
        
        return {
            implantConstantsToController: implantConstantsToController
        };
        
        function implantConstantsToController(ctrl){
            // put these constants to target controller
            
            ctrl.severities = [{text: "Info", value: 0}, {text: "Warning", value: 1}, {text: "Critical", value: 2}];
            ctrl.operators = ['==', '>', '>=', '<', '<=', '!='];
            ctrl.periods = [{text: "1分钟", value: '1m'}, {text: "2分钟", value: '2m'}, {text: "5分钟", value: '5m'}];
            ctrl.statistics = [{text: "平均值", value: 'mean'}, {text: "最大值", value: 'max'}, {text: "最小值", value: 'min'},
                {text: "第一个值", value: 'first'}, {text: "最后一个值", value: 'last'}, {text: "总值", value: 'sum'}];

        }
    }


}(angular, moment, sprintf));
