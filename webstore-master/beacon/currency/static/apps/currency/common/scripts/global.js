/**
 * Created by bluven on 16-7-12.
 */

jQuery.extend(jQuery.validator.messages, {
    required: "请填入数据",
    email: "邮件格式不对",
    url: "URL格式不对",
    date: "不是有效的日期",
    dateISO: "不是有效的ISO日期",
    number: "不是有效的数字",
    digits: "只能输入数字",
    creditcard: "信用卡号不对",
    equalTo: "两次输入信息不同",
    accept: "数据格式不对",
    maxlength: jQuery.validator.format("最多不能超过{0}个字符"),
    minlength: jQuery.validator.format("最少要输入{0}个字符"),
    range: jQuery.validator.format("允许的值在{0}与{1}之间."),
    max: jQuery.validator.format("最大值不能超过{0}."),
    min: jQuery.validator.format("最小值不能低于{0}.")
});

jQuery.validator.addMethod('ip', function(value, element){
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
}, "IP地址格式不对");

jQuery.validator.addMethod('complexPassword', function(value, element){
    if(value.length < 8){
        return false;
    }
    return /[a-z]+/.test(value) && /[A-Z]+/.test(value) && /[0-9]+/.test(value) && !/\W+/.test(value);
}, "请使用包含大小写字母及数字组成的强密码");

jQuery.validator.addMethod("regexp", function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        }, "请检查您的格式" );

if(window.bootbox){
    window.bootbox.setDefaults("locale", "zh_CN");
}
