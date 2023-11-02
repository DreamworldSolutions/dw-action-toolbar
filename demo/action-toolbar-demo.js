import { css, html, LitElement } from "@dreamworld/pwa-helpers/lit.js";
import "../dw-action-toolbar";
class ActionToolbarDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --dw-select-bg-color: #fff;
        }

        header {
          background: lightcoral;
        }

        footer {
          background: lightseagreen;
        }

        header,
        footer {
          display: flex;
          padding: 4px 16px;
          align-items: center;
        }

        header > .title,
        footer > .title {
          flex: 1;
        }

        .content {
          padding: 16px;
          min-height: 500px;
        }
      `,
    ];
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
    this.dialogTitle = "Board actions";
    this.actions = [
      { name: "OPEN", label: "Open", icon: "folder_open" },
      { name: "ADD", label: "Add", icon: "add" },
      { name: "EDIT", label: "Edit", icon: "edit" },
      {
        name: "DOWNLOAD",
        label: "Download",
        icon: "download",
        type: "expandable",
        subActions: [
          { name: "PDF", label: "PDF", icon: "picture_as_pdf" },
          { name: "Excel", label: "Excel", icon: "description" },
        ],
      },
      {
        name: "SHARE",
        label: "Share",
        icon: "share",
        type: "expandable",
        subActions: [
          { name: "SMS", label: "SMS", icon: "sms" },
          { name: "EMAIL", label: "E Mail", icon: "mail" },
        ],
      },
      { name: "DELETE", label: "Delete", icon: "delete", danger: true },
    ];
    this.disabledActions = { EDIT: "User has no write permission" };
    this.hiddenActions = ["OPEN"];
    this.mobileMode = true;
  }

  render() {
    return html`
      <header>
        <div class="title">Header</div>
        <dw-action-toolbar
          @action=${this._action}
          .dialogTitle=${this.dialogTitle}
          .actions=${this.actions}
          .disabledActions=${this.disabledActions}
          .hiddenActions=${this.hiddenActions}
          .dialogHAlign=${"right"}
          .mobileMode=${false}
        >
        </dw-action-toolbar>
      </header>

      <div class="content">
        <h4>
          Lorem Ipsum छपाई और अक्षर योजन उद्योग का एक साधारण डमी पाठ है. Lorem Ipsum सन १५०० के बाद
          से अभी तक इस उद्योग का मानक डमी पाठ मन गया, जब एक अज्ञात मुद्रक ने नमूना लेकर एक नमूना
          किताब बनाई. यह न केवल पाँच सदियों से जीवित रहा बल्कि इसने इलेक्ट्रॉनिक मीडिया में छलांग
          लगाने के बाद भी मूलतः अपरिवर्तित रहा. यह 1960 के दशक में Letraset Lorem Ipsum अंश युक्त
          पत्र के रिलीज के साथ लोकप्रिय हुआ, और हाल ही में Aldus PageMaker Lorem Ipsum के संस्करणों
          सहित तरह डेस्कटॉप प्रकाशन सॉफ्टवेयर के साथ अधिक प्रचलित हुआ.
        </h4>
        <h4>
          यह एक लंबा स्थापित तथ्य है कि जब एक पाठक एक पृष्ठ के खाखे को देखेगा तो पठनीय सामग्री से
          विचलित हो जाएगा. Lorem Ipsum का उपयोग करने का मुद्दा यह है कि इसमें एक और अधिक या कम
          अक्षरों का सामान्य वितरण किया गया है, 'Content here, content here' प्रयोग करने की जगह इसे
          पठनीय English के रूप में प्रयोग किया जाये. अब कई डेस्कटॉप प्रकाशन संकुल और वेब पेज संपादक
          उनके डिफ़ॉल्ट मॉडल पाठ के रूप में Lorem Ipsum उपयोग करते हैं, और अब "Lorem Ipsum" के लिए
          खोज अपने शैशव में कई वेब साइटों को उजागर करती है. इसके विभिन्न संस्करणों का वर्षों में
          विकास हुआ है, कभी दुर्घटना से, तो कभी प्रयोजन पर (हास्य और लगाव डालने के लिए).
        </h4>
        <h4>
          आम धारणा के विपरीत Lorem Ipsum बस यादृच्छिक (random) पाठ नहीं है. यह 45 ई.पू. से शास्त्रीय
          लैटिन साहित्य के एक टुकड़े से जुड़ा है, जो इसे 2000 वर्ष से अधिक प्राचीन बनाता है. Richard
          McClintock, हेम्प्डन-वर्जीनिया में सिडनी कॉलेज में एक लैटिन प्रोफेसर है, ने एक Lorem
          इप्सुम में से एक और अधिक अस्पष्ट लैटिन शब्द देखा और शास्त्रीय साहित्य के शहर में जाते हुए
          असंदेहदास्पक स्रोत की खोज की. Lorem Ipsum सिसरौ(Sisero) द्वारा "De Finibus Bonorum et
          Malorum" (अच्छाई और बुराई की चरम सीमा) के 1.10.32 और 1.10.33 वर्गों से आता है जो ४५ BC में
          लिखा गया था. यह पुस्तक "नैतिकता के सिद्धांत" विषय पर निबंध, जो नवजागरण के दौर का एक बहुत
          लोकप्रिय ग्रंथ है. Lorem Ipsum की पहली पंक्ति, "Lorem ipsum dolor sit amet..", 1.10.32 खंड
          में एक पंक्ति से आती है.
        </h4>
        <h4>
          Lorem Ipsum के अंश कई रूप में उपलब्ध हैं, लेकिन बहुमत को किसी अन्य रूप में परिवर्तन का
          सामना करना पड़ा है, हास्य डालना या क्रमरहित शब्द , जो तनिक भी विश्वसनीय नहीं लग रहे हो.
          यदि आप Lorem Ipsum के एक अनुच्छेद का उपयोग करने जा रहे हैं, तो आप को यकीन दिला दें कि पाठ
          के मध्य में वहाँ कुछ भी शर्मनाक छिपा हुआ नहीं है. इंटरनेट पर सभी Lorem Ipsum जनरेटर
          पूर्वनिर्धारित मात्रा में अनुच्छेद को दोहराने कि वजह से इंटरनेट पर सबसे विश्वसनीय जनरेटर
          होने के लिए जाने जाते हैं. यह एक 200 से भी अधिक लैटिन शब्दों के शब्दकोश का उपयोग करता है ,
          जो एक मुट्ठी भर मॉडल वाक्य संरचना के साथ संयुक्त होकर Lorem Ipsum उत्पन्न करता है जो उचित
          भी लगता है. इसलिए उत्पन्न Lorem Ipsum हमेशा पुनरावृत्ति, हास्य, या गैर विशेषता शब्दों आदि
          से मुक्त होता है.
        </h4>
      </div>

      <footer>
        <div class="title">Footer</div>
        <dw-action-toolbar
          @action=${this._action}
          .primaryActions="${["SHARE", "DOWNLOAD"]}"
          .dialogTitle=${this.dialogTitle}
          .actions=${this.actions}
          .disabledActions=${this.disabledActions}
          .hiddenActions=${this.hiddenActions}
          .dialogHAlign=${"right"}
          .mobileMode=${true}
        >
        </dw-action-toolbar>
      </footer>
    `;
  }

  _action(e) {
    console.log("action changed :", e);
  }
}

customElements.define("action-toolbar-demo", ActionToolbarDemo);
