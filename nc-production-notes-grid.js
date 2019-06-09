import { PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@neogrup/nc-items-grid/nc-items-grid.js';
import '@neogrup/nc-products-grid/nc-products-grid.js';
// import { flush } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class NcProductionNotesGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        .optionsContainer{
          width: 100%;
          height: var(--options-container-height);
        }

        .elementsContainer{
          width: 100%;
          height: calc(100% - var(--options-container-height));
        }

      </style>

      <div class="optionsContainer">
        <nc-items-grid 
            id="gridProductionNotesOptions" 
            language="{{language}}" 
            items-grid-data="{{productionNotesOptions}}" 
            loading="{{itemsGridLoading}}" 
            keep-item-selected is-paginated
            auto-flow
            item-height="[[heightProductionNotesGridItems]]"
            item-width="[[widthProductionNotesGridItems]]"
            on-item-selected="_productionNotesOptionSelected">
        </nc-items-grid>
      </div>

      <div class="elementsContainer">
        <nc-products-grid 
            id="gridProductionNotesProducts" 
            language="{{language}}" 
            products-grid-data="{{productionNotesElementsGridData}}" 
            height-products-grid-items="[[heightProductionNotesGridItems]]" 
            width-products-grid-items="[[widthProductionNotesGridItems]]" 
            loading="{{itemsGridLoading}}" 
            on-product-selected="_productionNotesElementSelected">
        </nc-products-grid>
      </div>
    `;
  }

  static get properties() {
    return {
      productionNotesOptions: {
        type: Array,
        value: []
      },
      lineDocSelected: {
        type: Object,
        value: {}
      },
      productionNotesOptionCodeSelected: {
        type: String,
        observer: '_productionNotesOptionCodeSelected'
      },
      productionNotesElementsGridData: {
        type: Array,
      },
      language: String,
      breadcrumb: {
        type: Boolean,
        value: false
      },
      heightProductionNotesGridItems: {
        type: Number,
        reflectToAttribute: true,
        observer: '_heightProductionNotesButtonsChanged'
      },
      widthProductionNotesGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      marginProductionNotesGridItems: {
        type: Number,
        reflectToAttribute: true
      },
      viewModeProductionNotesGridItems: {
        type: String,
        reflectToAttribute: true
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }


  setDocLineSelected(lineDocSelected){
    this.lineDocSelected = lineDocSelected;
  }
  


  setOptions(productionNotesOptions){
    this.set('productionNotesElementsGridData',[]);
    this.set('productionNotesOptions',[]);
    let productionNotesOptionsFiltered = productionNotesOptions.filter(this.checkOptionVisible);
    this.set('productionNotesOptions',productionNotesOptionsFiltered);
    // flush();
    this.selectDefaultOption();
  }

  checkOptionVisible(productionNotesOption){
    return (productionNotesOption.hasOwnProperty('visible') ? false: true);
  }

  selectDefaultOption(){
    this.productionNotesOptionCodeSelected = this.productionNotesOptions[0].code;
    this.productionNotesElementsGridData = this.productionNotesOptions[0].content;
  }

  _productionNotesOptionSelected(option){
    this.productionNotesOptionCodeSelected = option.detail.code;
    this.productionNotesElementsGridData = option.detail.content;
  }

  _productionNotesOptionCodeSelected(option){
    this.$.gridProductionNotesOptions.selectItem(option);
  }

  _productionNotesElementSelected(item){
    this.dispatchEvent(new CustomEvent('production-notes-line-selected', {detail: {product: item.detail, productionNotesOptionCodeSelected: this.productionNotesOptionCodeSelected}, bubbles: true, composed: true }));
  }

  _heightProductionNotesButtonsChanged(){
    let optionsContainerHeight = parseInt(this.heightProductionNotesGridItems) + 20;
    this.updateStyles({'--options-container-height':   optionsContainerHeight + 'px' });
  }
}

window.customElements.define('nc-production-notes-grid', NcProductionNotesGrid);
