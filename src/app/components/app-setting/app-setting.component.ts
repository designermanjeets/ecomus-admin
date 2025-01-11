import { AppValues } from './../../shared/interface/setting.interface';
import { Component, Inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { DOCUMENT } from '@angular/common';
import { Select2, Select2Data, Select2SearchEvent } from 'ng-select2-component';
import { Observable, Subject, debounceTime, forkJoin } from 'rxjs';
import { GetBlogs } from '../../shared/action/blog.action';
import { GetProducts } from '../../shared/action/product.action';
import { GetCategories } from '../../shared/action/category.action';
import { GetAppSettingOption, 
          UpdateAppSettingOption } from '../../shared/action/setting.action';
import { ProductState } from '../../shared/state/product.state';
import { CategoryState } from '../../shared/state/category.state';
import { CouponState } from '../../shared/state/coupon.state';
import { SettingState } from '../../shared/state/setting.state';
import { BrandState } from '../../shared/state/brand.state';
import { StoreState } from '../../shared/state/store.state';
import { BlogState } from '../../shared/state/blog.state';
import { Params } from '../../shared/interface/core.interface';
import { Banners } from '../../shared/interface/theme.interface';
import { AppSetting } from '../../shared/interface/setting.interface';
import * as data from '../../shared/data/home-page';
import { GetCoupons } from '../../shared/action/coupon.action';
import * as media from '../../shared/data/media-config'; 
import { GetBrands } from '../../shared/action/brand.action';
import { GetStores } from '../../shared/action/store.action';

export type CustomLinkForm = AbstractControl & {
  controls: { [key: string]: AbstractControl };
  registerControl: (name: string, control: AbstractControl) => void;
  addControl: (name: string, control: AbstractControl) => void;
  removeControl: (name: string) => void;
  setControl: (name: string, control: AbstractControl) => void;
};

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-setting.component.html',
  styleUrl: './app-setting.component.scss'
})
export class AppSettingComponent {

  @Select(ProductState.products) product$: Observable<Select2Data>;  
  @Select(CouponState.coupons) coupons$: Observable<Select2Data>;
  @Select(SettingState.appSetting) setting$: Observable<AppSetting>;
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  
  @Select(BrandState.brands) brand$: Observable<Select2Data>;  
  @Select(StoreState.stores) store$: Observable<Select2Data>;  
  @Select(BlogState.blogs) blogs$: Observable<Select2Data>;

  public form: FormGroup;
  public page_data: AppValues | null;
  public active = 'home_banner';
  public banner = 1;
  public sub_banner = 1;
  public main_content = 1;
  public sort = data.sort;
  public productIds: number[] = [];
  public mediaConfig = media.mediaConfig;

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
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.form = new FormGroup({
      values: new FormGroup({
        home_banner: new FormGroup({
          status: new FormControl(true),
          banners: new FormArray([])
        }),
        categories_list: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          category_ids: new FormControl([]),
        }),
        offer_products: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          product_ids: new FormControl([]),
        }),
        section_1_products: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          product_ids: new FormControl([]),
        }),
        section_2_products: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          product_ids: new FormControl([]),
        }),
        coupons: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          coupon_ids: new FormControl([])
        }),
        section_3_products: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          product_ids: new FormControl([]),
        }),
        seller: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          store_ids: new FormControl([]),
        }),
        brands: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          brand_ids: new FormControl([])
        }),
        blogs: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          sub_title: new FormControl(),
          blog_ids: new FormControl([]),
        }),
        navigate_button: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(),
          button_text: new FormControl(),
          redirect_link: new FormGroup({
            link: new FormControl(),
            link_type: new FormControl(),
          }),
        }),
        products_ids: new FormControl([]),
      }),
    });
  }

  get homeBanner(): FormArray {
    return this.form.get('values.home_banner.banners') as FormArray
  }

  ngOnInit() {
    const blogs$ = this.store.dispatch(new GetBlogs({ status: 1 }));
    const app_setting$ = this.store.dispatch(new GetAppSettingOption());
    const coupon$ = this.store.dispatch(new GetCoupons());
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
    const brand$ = this.store.dispatch(new GetBrands({ status: 1 }));
    const store$ = this.store.dispatch(new GetStores({ status: 1 }));

    forkJoin([ blogs$, app_setting$, categories$, coupon$, brand$, store$]).subscribe({
      complete: () => { 
        this.store.select(SettingState.appSetting).subscribe({
          next: (setting) => { 
            if(setting?.products_ids){
              this.filter['paginate'] = setting?.products_ids?.length >= 15 ? setting?.products_ids?.length: 15;
              this.filter['ids'] = setting?.products_ids?.join();
              this.filter['with_union_products'] = setting?.products_ids?.length ? setting?.products_ids?.length >= 15 ? 0 : 1 : 0; 
            }
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
        this.filter['search'] = inputValue; 
        this.getProducts(this.filter)
        this.renderer.addClass(this.document.body, 'loader-none');
    });
  }

  patchForm() {
    this.store.select(SettingState.appSetting).subscribe(setting => {
      this.page_data = setting;
      this.form.patchValue({
        values: {
          home_banner: {
            status: setting?.home_banner?.status,
          },
          categories_list: {
            status: setting?.categories_list?.status,
            title: setting?.categories_list?.title,
            category_ids: setting?.categories_list?.category_ids,
          },
          offer_products: {
            status: setting?.offer_products?.status,
            title: setting?.offer_products?.title,
            sub_title: setting?.offer_products?.sub_title,
            product_ids: setting?.offer_products?.product_ids,
          },
          section_1_products: {
            status: setting?.section_1_products?.status,
            title: setting?.section_1_products?.title,
            sub_title: setting?.section_1_products?.sub_title,
            product_ids: setting?.section_1_products?.product_ids,
          },
          section_2_products: {
            status: setting?.section_2_products?.status,
            title: setting?.section_2_products?.title,
            sub_title: setting?.section_2_products?.sub_title,
            product_ids: setting?.section_2_products?.product_ids,
          },
          coupons: {
            status: setting?.coupons?.status,
            title: setting?.coupons?.title,
            sub_title: setting?.coupons?.sub_title,
            coupon_ids: setting?.coupons?.coupon_ids
          },
          section_3_products: {
            status: setting?.section_3_products?.status,
            title: setting?.section_3_products?.title,
            sub_title: setting?.section_3_products?.sub_title,
            product_ids: setting?.section_3_products?.product_ids,
          },
          seller: {
            status: setting?.seller?.status,
            title: setting?.seller?.title,
            sub_title: setting?.seller?.sub_title,
            store_ids: setting?.seller?.store_ids,
          },
          brands: {
            status: setting?.brands?.status,
            title: setting?.brands?.title,
            brand_ids: setting?.brands?.brand_ids,
          },
          blogs: {
            status: setting?.blogs?.status,
            title: setting?.blogs?.title,
            sub_title: setting?.blogs?.sub_title,
            blog_ids: setting?.blogs?.blog_ids
          },
          navigate_button: {
            status: setting?.navigate_button?.status,
            title: setting?.navigate_button?.title,
            button_text: setting?.navigate_button?.button_text,
            redirect_link: {
              link: setting?.navigate_button?.redirect_link?.link,
              link_type: setting?.navigate_button?.redirect_link?.link_type,
              product_ids: setting?.navigate_button?.redirect_link?.product_ids,
            },
          },
          products_ids: setting?.products_ids,
        },
      });

      this.homeBanner.clear();
      setting?.home_banner?.banners?.forEach((banner: Banners) => 
      this.homeBanner.push(
        this.formBuilder.group({
          redirect_link: new FormGroup({
            link: new FormControl(banner?.redirect_link?.link),
            link_type: new FormControl(banner?.redirect_link?.link_type),
          }),
          status: new FormControl(banner?.status),
          image_url: new FormControl(banner?.image_url),
        })
      ));

    });
  }
  
  getProducts(filter: Params){
    this.filter['search'] = filter['search'];
    this.filter['ids'] = this.filter['search'].length ? '' : this.page_data?.products_ids?.join()
    this.filter['paginate'] = this.page_data?.products_ids?.length >= 15 ? this.page_data?.products_ids?.length: 15;
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

  addBanner(event: Event) {
    event.preventDefault();
    this.homeBanner.push(
      this.formBuilder.group({
        redirect_link: new FormGroup({
          link: new FormControl(''),
          link_type: new FormControl(''),
          product_ids: new FormControl(''),
        }),
        image_url: new FormControl(),
        status: new FormControl(true),
      })
    );
  }

  remove(index: number) {
    if(this.homeBanner.length <= 1) return
      this.homeBanner.removeAt(index);
  }

  selectImage(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  selectBannerArray(url: string, index: number){
    this.homeBanner.at(index).get('image_url')?.setValue(url ? url : null);
  }
    
  // Merge Products Ids
  concatDynamicProductKeys(obj: AppSetting) {
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

  submit(){
    const productIds = Array.from(new Set(this.concatDynamicProductKeys(this.form.value)));
    this.form.get('values.products_ids')?.setValue(productIds);
    
    if(this.form.valid) {
      this.store.dispatch(new UpdateAppSettingOption(this.form.value));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
