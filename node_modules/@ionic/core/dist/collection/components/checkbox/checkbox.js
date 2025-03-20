/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { inheritAriaAttributes, renderHiddenInput } from "../../utils/helpers";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - The label text to associate with the checkbox. Use the "labelPlacement" property to control where the label is placed relative to the checkbox.
 *
 * @part container - The container for the checkbox mark.
 * @part label - The label text describing the checkbox.
 * @part mark - The checkmark used to indicate the checked state.
 * @part supporting-text - Supporting text displayed beneath the checkbox label.
 * @part helper-text - Supporting text displayed beneath the checkbox label when the checkbox is valid.
 * @part error-text - Supporting text displayed beneath the checkbox label when the checkbox is invalid and touched.
 */
export class Checkbox {
    constructor() {
        this.inputId = `ion-cb-${checkboxIds++}`;
        this.helperTextId = `${this.inputId}-helper-text`;
        this.errorTextId = `${this.inputId}-error-text`;
        this.inheritedAttributes = {};
        /**
         * Sets the checked property and emits
         * the ionChange event. Use this to update the
         * checked state in response to user-generated
         * actions such as a click.
         */
        this.setChecked = (state) => {
            const isChecked = (this.checked = state);
            this.ionChange.emit({
                checked: isChecked,
                value: this.value,
            });
        };
        this.toggleChecked = (ev) => {
            ev.preventDefault();
            this.setFocus();
            this.setChecked(!this.checked);
            this.indeterminate = false;
        };
        this.onFocus = () => {
            this.ionFocus.emit();
        };
        this.onBlur = () => {
            this.ionBlur.emit();
        };
        this.onClick = (ev) => {
            if (this.disabled) {
                return;
            }
            this.toggleChecked(ev);
        };
        this.color = undefined;
        this.name = this.inputId;
        this.checked = false;
        this.indeterminate = false;
        this.disabled = false;
        this.errorText = undefined;
        this.helperText = undefined;
        this.value = 'on';
        this.labelPlacement = 'start';
        this.justify = undefined;
        this.alignment = undefined;
        this.required = false;
    }
    componentWillLoad() {
        this.inheritedAttributes = Object.assign({}, inheritAriaAttributes(this.el));
    }
    /** @internal */
    async setFocus() {
        if (this.focusEl) {
            this.focusEl.focus();
        }
    }
    getHintTextID() {
        const { el, helperText, errorText, helperTextId, errorTextId } = this;
        if (el.classList.contains('ion-touched') && el.classList.contains('ion-invalid') && errorText) {
            return errorTextId;
        }
        if (helperText) {
            return helperTextId;
        }
        return undefined;
    }
    /**
     * Responsible for rendering helper text and error text.
     * This element should only be rendered if hint text is set.
     */
    renderHintText() {
        const { helperText, errorText, helperTextId, errorTextId } = this;
        /**
         * undefined and empty string values should
         * be treated as not having helper/error text.
         */
        const hasHintText = !!helperText || !!errorText;
        if (!hasHintText) {
            return;
        }
        return (h("div", { class: "checkbox-bottom" }, h("div", { id: helperTextId, class: "helper-text", part: "supporting-text helper-text" }, helperText), h("div", { id: errorTextId, class: "error-text", part: "supporting-text error-text" }, errorText)));
    }
    render() {
        const { color, checked, disabled, el, getSVGPath, indeterminate, inheritedAttributes, inputId, justify, labelPlacement, name, value, alignment, required, } = this;
        const mode = getIonMode(this);
        const path = getSVGPath(mode, indeterminate);
        renderHiddenInput(true, el, name, checked ? value : '', disabled);
        return (h(Host, { key: '7ac31df89b07c781ddcd30a6a8c109494d0c500a', "aria-checked": indeterminate ? 'mixed' : `${checked}`, "aria-describedby": this.getHintTextID(), "aria-invalid": this.getHintTextID() === this.errorTextId, class: createColorClasses(color, {
                [mode]: true,
                'in-item': hostContext('ion-item', el),
                'checkbox-checked': checked,
                'checkbox-disabled': disabled,
                'checkbox-indeterminate': indeterminate,
                interactive: true,
                [`checkbox-justify-${justify}`]: justify !== undefined,
                [`checkbox-alignment-${alignment}`]: alignment !== undefined,
                [`checkbox-label-placement-${labelPlacement}`]: true,
            }), onClick: this.onClick }, h("label", { key: '674e923fe1ec83a33c31d67b0d414d61ba8f9e4b', class: "checkbox-wrapper" }, h("input", Object.assign({ key: 'c4866e392fbdf3b76edcd1507cb67f40a213a4e7', type: "checkbox", checked: checked ? true : undefined, disabled: disabled, id: inputId, onChange: this.toggleChecked, onFocus: () => this.onFocus(), onBlur: () => this.onBlur(), ref: (focusEl) => (this.focusEl = focusEl), required: required }, inheritedAttributes)), h("div", { key: '79cb96e5963b9331a760438ec8cc9e456215de91', class: {
                'label-text-wrapper': true,
                'label-text-wrapper-hidden': el.textContent === '',
            }, part: "label" }, h("slot", { key: '896cb26292c9a4a6c105afb39611472b93bf5e90' }), this.renderHintText()), h("div", { key: '52cd22e79fd5db30b45d7b092aa5af3944392336', class: "native-wrapper" }, h("svg", { key: '18d862ab7cc32055eaf200eea560ff1b2b6cbde0', class: "checkbox-icon", viewBox: "0 0 24 24", part: "container" }, path)))));
    }
    getSVGPath(mode, indeterminate) {
        let path = indeterminate ? (h("path", { d: "M6 12L18 12", part: "mark" })) : (h("path", { d: "M5.9,12.5l3.8,3.8l8.8-8.8", part: "mark" }));
        if (mode === 'md') {
            path = indeterminate ? (h("path", { d: "M2 12H22", part: "mark" })) : (h("path", { d: "M1.73,12.91 8.1,19.28 22.79,4.59", part: "mark" }));
        }
        return path;
    }
    static get is() { return "ion-checkbox"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["checkbox.ios.scss"],
            "md": ["checkbox.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["checkbox.ios.css"],
            "md": ["checkbox.md.css"]
        };
    }
    static get properties() {
        return {
            "color": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Color",
                    "resolved": "\"danger\" | \"dark\" | \"light\" | \"medium\" | \"primary\" | \"secondary\" | \"success\" | \"tertiary\" | \"warning\" | string & Record<never, never> | undefined",
                    "references": {
                        "Color": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::Color"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
                },
                "attribute": "color",
                "reflect": true
            },
            "name": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The name of the control, which is submitted with the form data."
                },
                "attribute": "name",
                "reflect": false,
                "defaultValue": "this.inputId"
            },
            "checked": {
                "type": "boolean",
                "mutable": true,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the checkbox is selected."
                },
                "attribute": "checked",
                "reflect": false,
                "defaultValue": "false"
            },
            "indeterminate": {
                "type": "boolean",
                "mutable": true,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the checkbox will visually appear as indeterminate."
                },
                "attribute": "indeterminate",
                "reflect": false,
                "defaultValue": "false"
            },
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the user cannot interact with the checkbox."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "errorText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Text that is placed under the checkbox label and displayed when an error is detected."
                },
                "attribute": "error-text",
                "reflect": false
            },
            "helperText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Text that is placed under the checkbox label and displayed when no error is detected."
                },
                "attribute": "helper-text",
                "reflect": false
            },
            "value": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "any | null",
                    "resolved": "any",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The value of the checkbox does not mean if it's checked or not, use the `checked`\nproperty for that.\n\nThe value of a checkbox is analogous to the value of an `<input type=\"checkbox\">`,\nit's only used when the checkbox participates in a native `<form>`."
                },
                "attribute": "value",
                "reflect": false,
                "defaultValue": "'on'"
            },
            "labelPlacement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'end' | 'fixed' | 'stacked'",
                    "resolved": "\"end\" | \"fixed\" | \"stacked\" | \"start\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Where to place the label relative to the checkbox.\n`\"start\"`: The label will appear to the left of the checkbox in LTR and to the right in RTL.\n`\"end\"`: The label will appear to the right of the checkbox in LTR and to the left in RTL.\n`\"fixed\"`: The label has the same behavior as `\"start\"` except it also has a fixed width. Long text will be truncated with ellipses (\"...\").\n`\"stacked\"`: The label will appear above the checkbox regardless of the direction. The alignment of the label can be controlled with the `alignment` property."
                },
                "attribute": "label-placement",
                "reflect": false,
                "defaultValue": "'start'"
            },
            "justify": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'end' | 'space-between'",
                    "resolved": "\"end\" | \"space-between\" | \"start\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "How to pack the label and checkbox within a line.\n`\"start\"`: The label and checkbox will appear on the left in LTR and\non the right in RTL.\n`\"end\"`: The label and checkbox will appear on the right in LTR and\non the left in RTL.\n`\"space-between\"`: The label and checkbox will appear on opposite\nends of the line with space between the two elements.\nSetting this property will change the checkbox `display` to `block`."
                },
                "attribute": "justify",
                "reflect": false
            },
            "alignment": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'center'",
                    "resolved": "\"center\" | \"start\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "How to control the alignment of the checkbox and label on the cross axis.\n`\"start\"`: The label and control will appear on the left of the cross axis in LTR, and on the right side in RTL.\n`\"center\"`: The label and control will appear at the center of the cross axis in both LTR and RTL.\nSetting this property will change the checkbox `display` to `block`."
                },
                "attribute": "alignment",
                "reflect": false
            },
            "required": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If true, screen readers will announce it as a required field. This property\nworks only for accessibility purposes, it will not prevent the form from\nsubmitting if the value is invalid."
                },
                "attribute": "required",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
    static get events() {
        return [{
                "method": "ionChange",
                "name": "ionChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the checked property has changed as a result of a user action such as a click.\n\nThis event will not emit when programmatically setting the `checked` property."
                },
                "complexType": {
                    "original": "CheckboxChangeEventDetail",
                    "resolved": "CheckboxChangeEventDetail<any>",
                    "references": {
                        "CheckboxChangeEventDetail": {
                            "location": "import",
                            "path": "./checkbox-interface",
                            "id": "src/components/checkbox/checkbox-interface.ts::CheckboxChangeEventDetail"
                        }
                    }
                }
            }, {
                "method": "ionFocus",
                "name": "ionFocus",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the checkbox has focus."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }, {
                "method": "ionBlur",
                "name": "ionBlur",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the checkbox loses focus."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }];
    }
    static get methods() {
        return {
            "setFocus": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            }
        };
    }
    static get elementRef() { return "el"; }
}
let checkboxIds = 0;
