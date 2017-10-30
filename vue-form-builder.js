/*!
 * vue-form-builder v0.0.0
 * https://github.com/ktsn/vue-form-builder
 *
 * @license
 * Copyright (c) 2017 katashin
 * Released under the MIT license
 * https://github.com/ktsn/vue-form-builder/blob/master/LICENSE
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VueFormBuilder = {})));
}(this, (function (exports) { 'use strict';

var assign = Object.assign || (function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });
    });
    return target;
});
function assert(condition, message) {
    if (!condition) {
        throw new Error('[vue-form-builder] ' + message);
    }
}
function toArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}
function looseIndexOf(list, value) {
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i] == value) {
            return i;
        }
    }
    return -1;
}

var selectValueDirective = {
    bind: setSelected,
    componentUpdated: setSelected
};
// Borrowed from vue's v-model directive
function setSelected(el, binding) {
    var multiple = el.multiple;
    var value = binding.value;
    for (var i = 0, len = el.options.length; i < len; i++) {
        var option = el.options[i];
        if (multiple) {
            var selected = looseIndexOf(value, option.value) > -1;
            if (option.selected !== selected) {
                option.selected = selected;
            }
        }
        else {
            if (option.value == value) {
                if (el.selectedIndex !== i) {
                    el.selectedIndex = i;
                }
                return;
            }
        }
    }
    if (!multiple) {
        el.selectedIndex = -1;
    }
}
function createHelper(name, props, generator) {
    return {
        name: name,
        props: props,
        inject: ['getModel'],
        directives: {
            selectValue: selectValueDirective
        },
        render: function (h) {
            var model = this.getModel();
            assert(model, "<" + name + "> must be used in the <form-for> slot");
            return generator(h, {
                model: model,
                props: this.$props,
                children: this.$slots.default
            });
        }
    };
}
function createInputHelper(name, type, getValueFn) {
    if (getValueFn === void 0) { getValueFn = getValue; }
    return createHelper(name, {
        for: {
            type: String,
            required: true
        }
    }, function (h, _a) {
        var props = _a.props, model = _a.model;
        var name = props.for;
        return h('input', {
            attrs: {
                type: type,
                name: model.attrName(name),
                id: model.attrId(name)
            },
            domProps: {
                value: model.getAttr(name)
            },
            on: {
                input: createInputListener(model, name, getValueFn)
            }
        });
    });
}
function createInputListener(model, attr, getValue) {
    return function (event) {
        var value = getValue(event);
        model.input(attr, value);
    };
}
function createSelectListener(model, attr) {
    return function (event) {
        var el = event.target;
        var selected = toArray(el.options)
            .filter(function (option) { return option.selected; })
            .map(function (option) { return option.value; });
        model.input(attr, el.multiple ? selected : selected[0]);
    };
}
function getValue(event) {
    return event.target.value;
}
function getNumber(event) {
    return Number(getValue(event));
}
var TextField = createInputHelper('text-field', 'text');
var NumberField = createInputHelper('number-field', 'number', getNumber);
var EmailField = createInputHelper('email-field', 'email');
var UrlField = createInputHelper('url-field', 'url');
var TelField = createInputHelper('tel-field', 'tel');
var SearchField = createInputHelper('search-field', 'search');
var PasswordField = createInputHelper('password-field', 'password');
var MonthField = createInputHelper('month-field', 'month');
var WeekField = createInputHelper('week-field', 'week');
var DatetimeField = createInputHelper('datetime-field', 'datetime');
var DatetimeLocalField = createInputHelper('datetime-local-field', 'datetime-local');
var DateField = createInputHelper('date-field', 'date');
var TimeField = createInputHelper('time-field', 'time');
var ColorField = createInputHelper('color-field', 'color');
var RangeField = createInputHelper('range-field', 'range', getNumber);
var HiddenField = createInputHelper('hidden-field', 'hidden');
var RadioButton = createHelper('radio-button', {
    for: {
        type: String,
        required: true
    },
    value: {
        type: null,
        required: true
    }
}, function (h, _a) {
    var model = _a.model, props = _a.props;
    var name = props.for, value = props.value;
    return h('input', {
        attrs: {
            type: 'radio',
            name: model.attrName(name),
            id: model.attrId(name, value)
        },
        domProps: {
            value: value,
            checked: model.getAttr(name) == value
        },
        on: {
            change: createInputListener(model, name, getValue)
        }
    });
});
var CheckBox = createHelper('check-box', {
    for: {
        type: String,
        required: true
    },
    value: {
        type: null
    },
    trueValue: {
        type: null,
        default: true
    },
    falseValue: {
        type: null,
        default: false
    }
}, function (h, _a) {
    var model = _a.model, props = _a.props;
    var name = props.for, value = props.value, trueValue = props.trueValue, falseValue = props.falseValue;
    var checked = model.isMultiple(name)
        ? looseIndexOf(model.getAttr(name), value) > -1
        : model.getAttr(name) == trueValue;
    var change = model.isMultiple(name)
        ? function (event) {
            var checked = event.target.checked;
            var modelValue = model.getAttr(name);
            var index = looseIndexOf(modelValue, value);
            if (checked) {
                if (index < 0) {
                    model.input(name, modelValue.concat(value));
                }
            }
            else {
                if (index > -1) {
                    var excluded = modelValue.slice(0, index)
                        .concat(modelValue.slice(index + 1));
                    model.input(name, excluded);
                }
            }
        }
        : function (event) {
            var checked = event.target.checked;
            model.input(name, checked ? trueValue : falseValue);
        };
    return h('input', {
        attrs: {
            type: 'checkbox',
            name: model.attrName(name),
            id: model.attrId(name, value)
        },
        domProps: {
            value: value,
            checked: checked
        },
        on: {
            change: change
        }
    });
});
var SelectField = createHelper('select-field', {
    for: {
        type: String,
        required: true
    }
}, function (h, _a) {
    var model = _a.model, props = _a.props, children = _a.children;
    var name = props.for;
    return h('select', {
        attrs: {
            name: model.attrName(name),
            id: model.attrId(name),
            multiple: model.isMultiple(name)
        },
        on: {
            change: createSelectListener(model, name)
        },
        directives: [
            {
                name: 'selectValue',
                value: model.getAttr(name)
            }
        ]
    }, children);
});
var TextArea = createHelper('text-area', {
    for: {
        type: String,
        required: true
    }
}, function (h, _a) {
    var model = _a.model, props = _a.props;
    var name = props.for;
    var modelValue = model.getAttr(name);
    return h('textarea', {
        attrs: {
            name: model.attrName(name),
            id: model.attrId(name)
        },
        domProps: {
            value: modelValue
        },
        on: {
            input: createInputListener(model, name, getValue)
        }
    }, modelValue);
});
var FieldLabel = createHelper('field-label', {
    for: {
        type: String,
        required: true
    },
    fieldValue: {
        type: null
    }
}, function (h, _a) {
    var model = _a.model, props = _a.props, children = _a.children;
    var name = props.for, fieldValue = props.fieldValue;
    return h('label', {
        attrs: {
            for: model.attrId(name, fieldValue)
        }
    }, children);
});
var helpers = {
    TextField: TextField,
    NumberField: NumberField,
    EmailField: EmailField,
    UrlField: UrlField,
    TelField: TelField,
    SearchField: SearchField,
    PasswordField: PasswordField,
    MonthField: MonthField,
    WeekField: WeekField,
    DatetimeField: DatetimeField,
    DatetimeLocalField: DatetimeLocalField,
    DateField: DateField,
    TimeField: TimeField,
    ColorField: ColorField,
    RangeField: RangeField,
    HiddenField: HiddenField,
    RadioButton: RadioButton,
    CheckBox: CheckBox,
    SelectField: SelectField,
    // Avoid Vue's warning
    'text-area': TextArea,
    FieldLabel: FieldLabel
};

var Model = /** @class */ (function () {
    function Model(name, value, cb) {
        this.name = name;
        this.value = value;
        this.cb = cb;
    }
    Model.prototype.isMultiple = function (attr) {
        return Array.isArray(this.value[attr]);
    };
    Model.prototype.input = function (attr, value) {
        this.value = assign({}, this.value, (_a = {},
            _a[attr] = value,
            _a));
        this.cb(this.value);
        var _a;
    };
    Model.prototype.attrName = function (attr) {
        var suffix = this.isMultiple(attr) ? '[]' : '';
        return this.name + '[' + attr + ']' + suffix;
    };
    Model.prototype.attrId = function (attr, value) {
        return this.name + '_' + attr + (value ? '_' + value : '');
    };
    Model.prototype.getAttr = function (attr) {
        return this.value[attr];
    };
    return Model;
}());
function createModel(name, value, cb) {
    return new Model(name, value, cb);
}

var FormFor = {
    name: 'form-for',
    props: {
        name: {
            type: String,
            required: true
        },
        model: {
            type: Object,
            required: true
        }
    },
    model: {
        prop: 'model',
        event: 'input'
    },
    computed: {
        formModel: function () {
            return createModel(this.name, this.model, this.onUpdate);
        }
    },
    methods: {
        onUpdate: function (value) {
            this.$emit('input', value);
        }
    },
    provide: function () {
        var _this = this;
        return {
            getModel: function () { return _this.formModel; }
        };
    },
    render: function (h) {
        return h('form', this.$slots.default);
    }
};

var FormBuilder = assign({
    FormFor: FormFor
}, helpers);
var FormBuilderMixin = {
    components: FormBuilder
};
function install(Vue) {
    Object.keys(FormBuilder).forEach(function (key) {
        var c = FormBuilder[key];
        Vue.component(c.name, c);
    });
}
/* global window */
if (typeof window !== 'undefined' && typeof window.Vue === 'function') {
    window.Vue.use(install);
}

exports.FormBuilderMixin = FormBuilderMixin;
exports['default'] = install;

Object.defineProperty(exports, '__esModule', { value: true });

})));
