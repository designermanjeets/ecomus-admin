import { Component, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { GetHomePage, UpdateHomePage } from '../../../shared/action/theme.action';
import { ThemeState } from '../../../shared/state/theme.state';
import { ProductState } from '../../../shared/state/product.state';
import { BlogState } from '../../../shared/state/blog.state';
import { CategoryState } from '../../../shared/state/category.state';
import { GetProducts } from '../../../shared/action/product.action';
import { GetCategories } from '../../../shared/action/category.action';
import { Moscow } from '../../../shared/interface/theme.interface';
import { Params } from '../../../shared/interface/core.interface';
import * as data from '../../../shared/data/home-page'
import { CategoryModel } from '../../../shared/interface/category.interface';
import { BrandState } from '../../../shared/state/brand.state';
import { StoreState } from '../../../shared/state/store.state';
import { GetStores } from '../../../shared/action/store.action';
import { GetBlogs } from '../../../shared/action/blog.action';
import * as media from '../../../shared/data/media-config';

@Component({
  selector: 'app-cairo',
  templateUrl: './cairo.component.html',
  styleUrl: './cairo.component.scss'
})
export class CairoComponent {
  @Select(ThemeState.homePage) home_page$: Observable<Moscow>;
  @Select(ProductState.products) product$: Observable<Select2Data>;  
  @Select(CategoryState.category) category$: Observable<CategoryModel>;  
  @Select(BlogState.blogs) blogs$: Observable<Select2Data>;
  @Select(BrandState.brands) brand$: Observable<Select2Data>; 
  @Select(StoreState.stores) store$: Observable<Select2Data>;  

  public page_data: Moscow;
  public active = 'home_banner';
  public form: FormGroup
  public banner = 1;
  public slider_product = 1;
  public sort = data.sort;
  public product_list_type = data.product_list_type;
  public mediaConfig = media.mediaConfig;
  public selectedSearchCategories: number[]; 
  public selectedListCategories: number[];  
  public selectedList2Categories: number[];  
  public selectedProductsCategories: number[];  

  private search = new Subject<string>();
  private destroy$ = new Subject<void>();

  public filter = {
    'status': 1,
    'search': '',
    'paginate': 15,
    'ids': '',
    'with_union_products': 0,
    'is_approved': 1
  };

  constructor(private store: Store, 
    public formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.form = new FormGroup({
      content: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(false),
          main_banner: new FormGroup({
            image_url: new FormControl(''),
            title: new FormControl(''),
            sub_title: new FormControl(''),
            search_enable: new FormControl(true),
            category_ids: new FormControl([]),
          })
        }),
        categories_icon_list: new FormGroup({
          status: new FormControl(false),
          category_ids: new FormControl([]),
        }),
        products_list_1: new FormGroup({
          title: new FormControl(''),
          product_ids: new FormControl([]),
          status: new FormControl(true),
        }),
        categories_icon_list_2: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(''),
          category_ids: new FormControl([]),
        }),
        slider_product: new FormGroup({
          status: new FormControl(true),
          image_url: new FormControl(''),        
          title: new FormControl(''),
          description: new FormControl(''),
          product_ids: new FormControl([]),
        }),
        seller: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          store_ids: new FormControl([]),
        }),
        categories_products: new FormGroup({
          title: new FormControl(''),
          status: new FormControl(true),
          category_ids: new FormControl([]),
        }),
        featured_blogs: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          description: new FormControl(),
          blog_ids: new FormControl([]),
        }),
        brands: new FormGroup({
          status: new FormControl(true),
          brand_ids: new FormControl([])
        }),
        news_letter: new FormGroup({
          status: new FormControl(false),
          title: new FormControl(''),
          image_url: new FormControl(''),
          sub_title: new FormControl(''),
        }),
        products_ids: new FormControl([]),
      }),
      slug: new FormControl('cairo')
    })
  }

  ngOnInit() {
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
    const home_page$ = this.store.dispatch(new GetHomePage({ slug: "cairo" }));
    const seller$ = this.store.dispatch(new GetStores({ status: 1 }));
    const blogs$ = this.store.dispatch(new GetBlogs({ status: 1 }));
    
    forkJoin([home_page$, categories$, seller$, blogs$]).subscribe({
      complete: () => { 
        this.store.select(ThemeState.homePage).subscribe({
          next: (homePage) => {
            if(homePage?.content?.products_ids){
              this.filter['paginate'] = homePage?.content?.products_ids?.length >= 15 ? homePage?.content?.products_ids?.length: 15;
              this.filter['ids'] = homePage?.content?.products_ids?.join();
              this.filter['with_union_products'] = homePage?.content?.products_ids?.length ? homePage?.content?.products_ids?.length >= 15 ? 0 : 1 : 0; 
            }
            this.patchForm();
            this.renderer.addClass(this.document.body, 'loader-none');
            this.store.dispatch(new GetProducts(this.filter)).subscribe({
              complete: () => {
                this.patchForm();
              }
            });
          } 
        });
      }     
    });

    this.search
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe((inputValue) => {
        this.store.dispatch(new GetProducts({ status: 1, is_approved: 1, paginate: 15, search: inputValue }));
        this.renderer.addClass(this.document.body, 'loader-none');
    });
  }

  patchForm() {
    this.store.select(ThemeState.homePage).subscribe(homePage => {
      this.page_data = homePage
      this.selectedSearchCategories =  homePage?.content?.home_banner?.main_banner?.category_ids  || [];
      this.selectedListCategories =  homePage?.content?.categories_icon_list?.category_ids  || [];
      this.selectedList2Categories =  homePage?.content?.categories_icon_list_2?.category_ids  || [];
      this.selectedProductsCategories =  homePage?.content?.categories_products?.category_ids  || [];
      this.form.patchValue({
        content: {
          home_banner: {
            status: homePage?.content?.home_banner?.status,
            main_banner: {
              image_url: homePage?.content?.home_banner?.main_banner?.image_url,
              title: homePage?.content?.home_banner?.main_banner?.title,
              sub_title: homePage?.content?.home_banner?.main_banner?.sub_title,
              search_enable: homePage?.content?.home_banner?.main_banner?.search_enable,
              category_ids: homePage?.content?.home_banner?.main_banner?.category_ids,
            }
          },
          categories_icon_list: {
            status: homePage?.content?.categories_icon_list?.status,
            category_ids: homePage?.content?.categories_icon_list?.category_ids,
          },
          products_list_1: {
            title: homePage?.content?.products_list_1?.title,
            product_ids: homePage?.content?.products_list_1?.product_ids,
            status: homePage?.content?.products_list_1?.status,
          },
          categories_icon_list_2: {
            title: homePage?.content?.categories_icon_list_2?.title,
            status: homePage?.content?.categories_icon_list_2?.status,
            category_ids: homePage?.content?.categories_icon_list_2?.category_ids,
          },
          slider_product: {
            status: homePage?.content?.slider_product?.status,
            image_url: homePage?.content?.slider_product?.image_url,        
            title: homePage?.content?.slider_product?.title,
            description: homePage?.content?.slider_product?.description,
            product_ids: homePage?.content?.slider_product?.product_ids,
          },
          seller: {
            status: homePage?.content?.seller?.status,
            title: homePage?.content?.seller?.title,
            store_ids: homePage?.content?.seller?.store_ids,
          },
          categories_products: {
            title: homePage?.content?.categories_products?.title,
            status: homePage?.content?.categories_products?.status,
            category_ids: homePage?.content?.categories_products?.category_ids,
          },
          featured_blogs: {
            title: homePage?.content?.featured_blogs?.title,
            description: homePage?.content?.featured_blogs?.description,
            status: homePage?.content?.featured_blogs?.status,
            blog_ids: homePage?.content?.featured_blogs?.blog_ids,
          },
          news_letter: {
            title: homePage?.content?.news_letter?.title,
            status: homePage?.content?.news_letter?.status,
            image_url: homePage?.content?.news_letter?.image_url,
            sub_title: homePage?.content?.news_letter?.sub_title,
          },
          brands: {
            brand_ids: homePage?.content?.brands?.brand_ids,
            status: homePage?.content?.brands?.status,
          },
          products_ids: homePage?.content?.products_ids,
        },
        slug: homePage?.slug
      })
    })
  }

  selectCategoryItem(data: Number[], key: string) {
    if(Array.isArray(data)) {
      this.form.get(key)?.setValue(data);
    }
  }
  
  getProducts(filter: Params){
    this.filter['search'] = filter['search'];
    this.filter['ids'] = this.filter['search'].length ? '' : this.page_data?.content?.products_ids?.join()
    this.filter['paginate'] = this.page_data?.content?.products_ids?.length >= 15 ? this.page_data?.content?.products_ids?.length: 15;
    this.store.dispatch(new GetProducts(this.filter));
    this.renderer.addClass(this.document.body, 'loader-none');
  }

  productDropdown(event: Select2){
    if(event['innerSearchText']){
      this.search.next('');
      this.getProducts(this.filter);
    }
  }
  
  searchProduct(event: Select2SearchEvent){
    this.search.next(event.search);
  }

  // Merge Products Ids
  concatDynamicProductKeys(obj: Moscow) {
    const result: number[]= [];
    function traverse(obj: any) {
      for (const key in obj) {
        if (key === 'product_ids' && Array.isArray(obj[key])) {
          result.push(...obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverse(obj[key]);
        }else {
          if(key === 'product_ids' && obj.product_ids){
            result.push(obj.product_ids)
          };
        }
      }
    }
    traverse(obj);
    return result;
  }
  
  selectBanner(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  submit(){
    const productIds = Array.from(new Set(this.concatDynamicProductKeys(this.form.value)));
    this.form.get('content.products_ids')?.setValue(productIds);

    if(this.form.valid) {
      this.store.dispatch(new UpdateHomePage(this.page_data.id, this.form.value));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}
