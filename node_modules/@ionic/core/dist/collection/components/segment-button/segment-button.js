/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h } from "@stencil/core";
import { addEventListener, removeEventListener, inheritAttributes, getNextSiblingOfType } from "../../utils/helpers";
import { hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
let ids = 0;
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part indicator - The indicator displayed on the checked segment button.
 * @part indicator-background - The background element for the indicator displayed on the checked segment button.
 */
export class SegmentButton {
    constructor() {
        this.segmentEl = null;
        this.inheritedAttributes = {};
        this.updateStyle = () => {
            forceUpdate(this);
        };
        this.updateState = () => {
            const { segmentEl } = this;
            if (segmentEl) {
                this.checked = segmentEl.value === this.value;
                if (segmentEl.disabled) {
                    this.disabled = true;
                }
            }
        };
        this.checked = false;
        this.contentId = undefined;
        this.disabled = false;
        this.layout = 'icon-top';
        this.type = 'button';
        this.value = 'ion-sb-' + ids++;
    }
    valueChanged() {
        this.updateState();
    }
    waitForSegmentContent(ionSegment, contentId) {
        return new Promise((resolve, reject) => {
            let timeoutId = undefined;
            let animationFrameId;
            const check = () => {
                if (!ionSegment) {
                    reject(new Error(`Segment not found when looking for Segment Content`));
                    return;
                }
                const segmentView = getNextSiblingOfType(ionSegment); // Skip the text nodes
                const segmentContent = segmentView === null || segmentView === void 0 ? void 0 : segmentView.querySelector(`ion-segment-content[id="${contentId}"]`);
                if (segmentContent && timeoutId) {
                    clearTimeout(timeoutId); // Clear the timeout if the segmentContent is found
                    cancelAnimationFrame(animationFrameId);
                    resolve(segmentContent);
                }
                else {
                    animationFrameId = requestAnimationFrame(check); // Keep checking on the next animation frame
                }
            };
            check();
            // Set a timeout to reject the promise
            timeoutId = setTimeout(() => {
                cancelAnimationFrame(animationFrameId);
                reject(new Error(`Unable to find Segment Content with id="${contentId} within 1000 ms`));
            }, 1000);
        });
    }
    async connectedCallback() {
        const segmentEl = (this.segmentEl = this.el.closest('ion-segment'));
        if (segmentEl) {
            this.updateState();
            addEventListener(segmentEl, 'ionSelect', this.updateState);
            addEventListener(segmentEl, 'ionStyle', this.updateStyle);
        }
        // Return if there is no contentId defined
        if (!this.contentId)
            return;
        let segmentContent;
        try {
            // Attempt to find the Segment Content by its contentId
            segmentContent = await this.waitForSegmentContent(segmentEl, this.contentId);
        }
        catch (error) {
            // If no associated Segment Content exists, log an error and return
            console.error('Segment Button: ', error.message);
            return;
        }
        // Ensure the found element is a valid ION-SEGMENT-CONTENT
        if (segmentContent.tagName !== 'ION-SEGMENT-CONTENT') {
            console.error(`Segment Button: Element with id="${this.contentId}" is not an <ion-segment-content> element.`);
            return;
        }
        // Prevent buttons from being disabled when associated with segment content
        if (this.disabled) {
            console.warn(`Segment Button: Segment buttons cannot be disabled when associated with an <ion-segment-content>.`);
            this.disabled = false;
        }
    }
    disconnectedCallback() {
        const segmentEl = this.segmentEl;
        if (segmentEl) {
            removeEventListener(segmentEl, 'ionSelect', this.updateState);
            removeEventListener(segmentEl, 'ionStyle', this.updateStyle);
            this.segmentEl = null;
        }
    }
    componentWillLoad() {
        this.inheritedAttributes = Object.assign({}, inheritAttributes(this.el, ['aria-label']));
    }
    get hasLabel() {
        return !!this.el.querySelector('ion-label');
    }
    get hasIcon() {
        return !!this.el.querySelector('ion-icon');
    }
    /**
     * @internal
     * Focuses the native <button> element
     * inside of ion-segment-button.
     */
    async setFocus() {
        const { nativeEl } = this;
        if (nativeEl !== undefined) {
            nativeEl.focus();
        }
    }
    render() {
        const { checked, type, disabled, hasIcon, hasLabel, layout, segmentEl } = this;
        const mode = getIonMode(this);
        const hasSegmentColor = () => (segmentEl === null || segmentEl === void 0 ? void 0 : segmentEl.color) !== undefined;
        return (h(Host, { key: 'e1e582b9a142cb07043ba08f02ad25f5a1fa5690', class: {
                [mode]: true,
                'in-toolbar': hostContext('ion-toolbar', this.el),
                'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
                'in-segment': hostContext('ion-segment', this.el),
                'in-segment-color': hasSegmentColor(),
                'segment-button-has-label': hasLabel,
                'segment-button-has-icon': hasIcon,
                'segment-button-has-label-only': hasLabel && !hasIcon,
                'segment-button-has-icon-only': hasIcon && !hasLabel,
                'segment-button-disabled': disabled,
                'segment-button-checked': checked,
                [`segment-button-layout-${layout}`]: true,
                'ion-activatable': true,
                'ion-activatable-instant': true,
                'ion-focusable': true,
            } }, h("button", Object.assign({ key: '8621a028894fb382854ff28779d0cadd3d9035f7', "aria-selected": checked ? 'true' : 'false', role: "tab", ref: (el) => (this.nativeEl = el), type: type, class: "button-native", part: "native", disabled: disabled }, this.inheritedAttributes), h("span", { key: '5c55858dbfb50734fb02d24091ebac3e0d05259f', class: "button-inner" }, h("slot", { key: '1f3bb8d76a1039ad648e202c650db06dfca88f79' })), mode === 'md' && h("ion-ripple-effect", { key: 'bda74b25bfdd431a8a36f0ee727b9184e9074321' })), h("div", { key: 'ff11369e921d6d0a540c75c37f692a3853e903f7', part: "indicator", class: "segment-button-indicator segment-button-indicator-animated" }, h("div", { key: '74ec4ca69331ed3f155fd8a8a356545941887df1', part: "indicator-background", class: "segment-button-indicator-background" }))));
    }
    static get is() { return "ion-segment-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["segment-button.ios.scss"],
            "md": ["segment-button.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["segment-button.ios.css"],
            "md": ["segment-button.md.css"]
        };
    }
    static get properties() {
        return {
            "contentId": {
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
                    "text": "The `id` of the segment content."
                },
                "attribute": "content-id",
                "reflect": true
            },
            "disabled": {
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
                    "text": "If `true`, the user cannot interact with the segment button."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "layout": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "SegmentButtonLayout",
                    "resolved": "\"icon-bottom\" | \"icon-end\" | \"icon-hide\" | \"icon-start\" | \"icon-top\" | \"label-hide\" | undefined",
                    "references": {
                        "SegmentButtonLayout": {
                            "location": "import",
                            "path": "./segment-button-interface",
                            "id": "src/components/segment-button/segment-button-interface.ts::SegmentButtonLayout"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Set the layout of the text and icon in the segment."
                },
                "attribute": "layout",
                "reflect": false,
                "defaultValue": "'icon-top'"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'submit' | 'reset' | 'button'",
                    "resolved": "\"button\" | \"reset\" | \"submit\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The type of the button."
                },
                "attribute": "type",
                "reflect": false,
                "defaultValue": "'button'"
            },
            "value": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "SegmentValue",
                    "resolved": "number | string",
                    "references": {
                        "SegmentValue": {
                            "location": "import",
                            "path": "../segment/segment-interface",
                            "id": "src/components/segment/segment-interface.ts::SegmentValue"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The value of the segment button."
                },
                "attribute": "value",
                "reflect": false,
                "defaultValue": "'ion-sb-' + ids++"
            }
        };
    }
    static get states() {
        return {
            "checked": {}
        };
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
                            "text": "Focuses the native <button> element\ninside of ion-segment-button."
                        }]
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "value",
                "methodName": "valueChanged"
            }];
    }
}
