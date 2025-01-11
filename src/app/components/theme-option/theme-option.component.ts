import { Component, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Select2Data } from 'ng-select2-component';
import { Editor } from 'ngx-editor';
import { Observable, forkJoin } from 'rxjs';
import { GetCategories } from '../../shared/action/category.action';
import { GetThemeOption, UpdateThemeOption } from '../../shared/action/theme-option.action';
import { GetProducts } from '../../shared/action/product.action';
import { CategoryState } from '../../shared/state/category.state';
import { ProductState } from '../../shared/state/product.state';
import { ThemeOptionState } from '../../shared/state/theme-option.state';
import { AboutFutures, ClientsContent, CustomDropdown, Member, Option, Review, TopBarContent } from '../../shared/interface/theme-option.interface';
import { Attachment } from '../../shared/interface/attachment.interface';
import { CategoryModel } from '../../shared/interface/category.interface';
import { BlogState } from '../../shared/state/blog.state';
import { GetBlogs } from '../../shared/action/blog.action';
import * as data from '../../shared/data/theme-option';
import * as media from '../../shared/data/media-config';

@Component({
  selector: 'app-theme-option',
  templateUrl: './theme-option.component.html',
  styleUrls: ['./theme-option.component.scss']
})
export class ThemeOptionComponent {
  
  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;
  @Select(CategoryState.category) category$: Observable<CategoryModel>;
  @Select(ProductState.products) product$: Observable<Select2Data>;  
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  
  @Select(BlogState.blogs) blogs$: Observable<Select2Data>;

  public active = 'general';
  public seller = 'about'
  public about = 'about'
  public popup = 'news_letter'
  public form: FormGroup;
  public selectedCategories: number[] = [];
  public selectedCollectionCategories: number[] = [];
  public theme_option_data: Option;
  public collection_layout = data.collection_layout;
  public product_layout = data.product_layout;
  public product_box_variant = data.product_box_variant;
  public language_direction: Select2Data = data.language_direction;
  public footer_layout: Select2Data = data.footer_layout;
  public useful_link = data.useful_link;
  public blog_sidebar = data.blog_sidebar_type;
  public help_center = data.help_center;
  public usefulLinks: number[] = [];
  public helpCenterIds: number[] = [];
  public editor: Editor;
  public html = '';
  public mediaConfig = media.mediaConfig;

  public top_bar_content = [
    { content: "" },
    { content: "" },
    { content: "" }
  ];
  public filter = {
    'search': '',
    'paginate': 15,
    'ids': '',
    'with_union_products': 0
  };

  public mode: Select2Data = [
    {
      value: 'light',
      label: 'Light',
    },
    {
      value: 'dark',
      label: 'Dark',
    }
  ];

  public cart_style: Select2Data = [
    {
      value: 'cart_sidebar',
      label: 'Cart Sidebar',
    },
    {
      value: 'cart_mini',
      label: 'Cart Mini',
    }
  ];

  constructor(private store: Store, private formBuilder: FormBuilder,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document){
    this.form = new FormGroup({
      general: new FormGroup({
        site_title: new FormControl(),
        site_tagline: new FormControl(),
        sticky_cart_enable: new FormControl(true),
        cart_style: new FormControl('cart_sidebar'),
        back_to_top_enable: new FormControl(false),
        language_direction: new FormControl('rtl'),
        primary_color: new FormControl(''),
        secondary_color: new FormControl(''),
        mode: new FormControl('light'),
        celebration_effect: new FormControl(true),
        seller_register_url: new FormControl(),
        exit_tagline_enable: new FormControl(true),
        taglines: new FormArray([
            new FormControl(''),
            new FormControl('')
        ]),
      }),
      logo: new FormGroup({
        header_logo_id: new FormControl(''),
        footer_logo_id: new FormControl(''),
        favicon_icon_id: new FormControl('')
      }),
      header: new FormGroup({
        sticky_header_enable: new FormControl(true),
        header_options: new FormControl('basic_header'),
        page_top_bar_enable: new FormControl(true),
        top_bar_content: new FormArray([]),
        page_top_bar_dark: new FormControl(false),
        support_number: new FormControl(''),
        today_deals: new FormControl([]),
        category_ids: new FormControl([]),
      }),
      footer: new FormGroup({
        footer_style: new FormControl('basic_footer'),
        bg_image: new FormControl(''),
        title: new FormControl(''),
        sub_title: new FormControl(''),
        footer_copyright: new FormControl(true),
        copyright_content: new FormControl(''),
        footer_about: new FormControl(''),
        about_address: new FormControl(''),
        about_email: new FormControl(''),
        footer_categories: new FormControl([]),
        useful_link: new FormControl([]),
        help_center: new FormControl([]),
        support_number: new FormControl(''),
        support_email: new FormControl(''),
        play_store_url: new FormControl(''),
        app_store_url: new FormControl(''),
        social_media_enable: new FormControl(true),
        facebook: new FormControl(''),
        instagram: new FormControl(''),
        twitter: new FormControl(''),
        pinterest: new FormControl(''),
      }),
      collection: new FormGroup({
        collection_layout: new FormControl('collection_category_slider'),
        collection_categories_ids: new FormControl([]),
        collection_banner_image_url: new FormControl('')
      }),
      product: new FormGroup({
        product_layout: new FormControl('product_images'),
        product_box_variant: new FormControl('basic'),
        image_bg: new FormControl(false),  
        product_box_bg: new FormControl(false),  
        product_box_border: new FormControl(true),  
        full_border: new FormControl(false),  
        is_trending_product: new FormControl(true), 
        banner_enable: new FormControl(true), 
        banner_image_url: new FormControl(''),
        safe_checkout: new FormControl(true),
        safe_checkout_image: new FormControl(''),
        secure_checkout: new FormControl(true),
        secure_checkout_image: new FormControl(''),
        encourage_order: new FormControl(true),
        encourage_max_order_count: new FormControl(''),
        encourage_view: new FormControl(true),
        encourage_max_view_count: new FormControl(''),
        sticky_checkout: new FormControl(true),
        sticky_product: new FormControl(true),
        social_share: new FormControl(true),
        shipping_and_return: new FormControl(''),
      }),
      blog: new FormGroup({
        blog_style: new FormControl('grid_view'),
        blog_sidebar_type: new FormControl('left_sidebar'),
        blog_author_enable: new FormControl(true),
        read_more_enable: new FormControl(true),
      }),
      seller: new FormGroup({
        about: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(''),
          description: new FormControl(''),
          image_url: new FormControl(''),
        }),
        services: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(''),
          service_1: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            image_url: new FormControl(''),
          }),
          service_2: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            image_url: new FormControl(''),
          }),
          service_3: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            image_url: new FormControl(''),
          }),
          service_4: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
            image_url: new FormControl(''),
          }),
        }),
        steps: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(''),
          step_1: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
          }),
          step_2: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
          }),
          step_3: new FormGroup({
            title: new FormControl(''),
            description: new FormControl(''),
          }),
        }),
        start_selling: new FormGroup({
          status: new FormControl(true),
          title: new FormControl(''),
          description: new FormControl(''),
        }),
        store_layout: new FormControl('basic_store'),
        store_details: new FormControl('basic_store_details'),
        store_image_url: new FormControl(''),
      }),
      contact_us: new FormGroup({
        contact_image_url: new FormControl(''),
        detail_1: new FormGroup({
          label: new FormControl(''),
          icon: new FormControl(''),
          text: new FormControl(''),
        }),
        detail_2: new FormGroup({
          label: new FormControl(''),
          icon: new FormControl(''),
          text: new FormControl(''),
        }),
        detail_3: new FormGroup({
          label: new FormControl(''),
          icon: new FormControl(''),
          text: new FormControl(''),
        }),
        detail_4: new FormGroup({
          label: new FormControl(''),
          icon: new FormControl(''),
          text: new FormControl(''),
        }),
      }),
      about_us: new FormGroup({
        about: new FormGroup({
          status: new FormControl(true),
          content_left_image_url: new FormControl(''),
          content_right_image_url: new FormControl(''),
          sub_title: new FormControl(''),
          title: new FormControl(''),
          description: new FormControl(''),
          futures: new FormArray([]),
        }),
        clients: new FormGroup({
          status: new FormControl(true),
          sub_title: new FormControl(''),
          title: new FormControl(''),
          content: new FormArray([]),
        }),
        team: new FormGroup({
          status: new FormControl(true),
          sub_title: new FormControl(''),
          title: new FormControl(''),
          members: new FormArray([]),
        }),
        testimonial: new FormGroup({
          status: new FormControl(true),
          sub_title: new FormControl(''),
          title: new FormControl(''),
          reviews: new FormArray([])
        }),
        blog: new FormGroup({
          status: new FormControl(true),
          blog_ids: new FormControl([]),
        })
      }),
      error_page: new FormGroup({
        error_page_content: new FormControl(''),
        back_button_enable: new FormControl(true),
        back_button_text: new FormControl(''),
      }),
      popup: new FormGroup({
        news_letter: new FormGroup({
          is_enable: new FormControl(true), 
          image_url: new FormControl(''),
          offer: new FormControl(''), 
          title: new FormControl(''),
          description: new FormControl(''),
        }),
        exit: new FormGroup({
          is_enable: new FormControl(true), 
          image_url: new FormControl(''),
          title: new FormControl(''),
          sub_title : new FormControl(''),
          description: new FormControl(''),
        }),
      }),
      seo: new FormGroup({
        meta_tags: new FormControl(''),
        meta_title: new FormControl(''),
        meta_description: new FormControl(''),
        og_title: new FormControl(''),
        og_description: new FormControl(''),
        og_image_id: new FormControl(),
      })
    });
  }

  ngOnInit() {
    const themeOption$ = this.store.dispatch(new GetThemeOption());
    const categories$ = this.store.dispatch(new GetCategories({ status: 1, type: 'product' }));
    const blog$ =  this.store.dispatch(new GetBlogs({ status: 1 }));
      
    forkJoin([themeOption$, categories$, blog$]).subscribe({
      complete: () => { 
        this.patchForm();
      }     
    });

    this.form.get('product.product_box_bg')?.valueChanges.subscribe((data) => {
      if(data) {
        this.form.get('product.image_bg')?.setValue(false);
        this.form.get('product.full_border')?.setValue(false);}
    })

    this.form.get('product.image_bg')?.valueChanges.subscribe((data) => {
      if(data) {
        this.form.get('product.product_box_bg')?.setValue(false);
        this.form.get('product.full_border')?.setValue(false);}
    })

    this.form.get('product.product_box_border')?.valueChanges.subscribe((data) => {
      if(data) {this.form.get('product.full_border')?.setValue(false);}
    })
    
    this.form.get('product.full_border')?.valueChanges.subscribe((data) => {
      if(data){
        this.form.get('product.product_box_border')?.setValue(false);
        this.form.get('product.product_box_bg')?.setValue(false);
        this.form.get('product.image_bg')?.setValue(false);
      }
    })

    this.editor = new Editor();
  }

  patchForm() {
    this.store.select(ThemeOptionState.themeOptions).subscribe(option => {
      this.selectedCategories = option?.footer?.footer_categories!;
      this.selectedCollectionCategories = option?.collection?.collection_categories_ids!;
      this.theme_option_data = option!;
      if(option?.header.today_deals?.length){
        let array = option?.header.today_deals
        this.filter['paginate'] = array?.length >= 15 ? array?.length: 15;
        this.filter['ids'] = array?.join();
        this.filter['with_union_products'] = array?.length ? array?.length >= 15 ? 0 : 1 : 0;
      }
      
      this.topBarContent.clear();
      this.initializeForm(option?.header?.top_bar_content!);
      this.usefulLinks = option?.footer?.useful_link?.map((link: CustomDropdown) => link.id) || [];
      this.helpCenterIds = option?.footer?.help_center?.map((link: CustomDropdown) => link.id) || [];
      this.form.patchValue({
        general: {
          site_title: option?.general?.site_title,
          site_tagline: option?.general?.site_tagline,
          sticky_cart_enable: option?.general?.sticky_cart_enable,
          cart_style: option?.general?.cart_style,
          back_to_top_enable: option?.general?.back_to_top_enable,
          language_direction: option?.general?.language_direction,
          primary_color: option?.general?.primary_color,
          secondary_color: option?.general?.secondary_color,
          mode: option?.general?.mode,
          seller_register_url: option?.general?.seller_register_url,
          exit_tagline_enable: option?.general?.exit_tagline_enable,
          taglines: option?.general?.taglines
        },
        logo: {
          header_logo_id : option?.logo?.header_logo_id,
          footer_logo_id: option?.logo?.footer_logo_id,
          favicon_icon_id: option?.logo?.favicon_icon_id,
        },
        seo: {
          meta_tags: option?.seo?.meta_tags,
          meta_title: option?.seo?.meta_title,
          meta_description: option?.seo?.meta_description,
          og_title: option?.seo?.og_title,
          og_description: option?.seo?.og_description,
          og_image_id: option?.seo?.og_image_id,
        },
        header: {
          sticky_header_enable: option?.header?.sticky_header_enable,
          header_options: option?.header?.header_options,
          page_top_bar_enable: option?.header?.page_top_bar_enable,
          top_bar_content: option?.header?.top_bar_content,
          page_top_bar_dark: option?.header?.page_top_bar_dark,
          support_number: option?.header?.support_number,
          today_deals: option?.header?.today_deals,
          category_ids: option?.header?.category_ids,
        },
        footer: {
          footer_style: option?.footer?.footer_style,
          bg_image: option?.footer?.bg_image,
          title: option?.footer?.title,
          sub_title: option?.footer?.sub_title,
          footer_copyright: option?.footer?.footer_copyright,
          copyright_content: option?.footer?.copyright_content,
          footer_about: option?.footer?.footer_about,
          about_address: option?.footer?.about_address,
          about_email: option?.footer?.about_email,
          footer_categories: option?.footer?.footer_categories,
          useful_link: option?.footer?.useful_link,
          help_center: option?.footer?.help_center,
          support_number: option?.footer?.support_number,
          support_email: option?.footer?.support_email,
          play_store_url: option?.footer?.play_store_url,
          app_store_url: option?.footer?.app_store_url,
          social_media_enable: option?.footer?.social_media_enable,
          facebook: option?.footer?.facebook,
          instagram: option?.footer?.instagram,
          twitter: option?.footer?.twitter,
          pinterest: option?.footer?.pinterest,
        },
        blog: {
          blog_style: option?.blog?.blog_style,
          blog_sidebar_type: option?.blog?.blog_sidebar_type,
          blog_author_enable: option?.blog?.blog_author_enable,
          read_more_enable: option?.blog?.read_more_enable,
        },
        seller: {
          about: {
            title: option?.seller?.about?.title,
            description: option?.seller?.about?.description,
            image_url: option?.seller?.about?.image_url
          },
          services: {
            status: option?.seller?.services?.status,
            title: option?.seller?.services?.title,
            service_1: {
              title: option?.seller?.services?.service_1?.title,
              description: option?.seller?.services?.service_1?.description,
              image_url: option?.seller?.services?.service_1?.image_url
            },
            service_2: {
              title: option?.seller?.services?.service_2?.title,
              description: option?.seller?.services?.service_2?.description,
              image_url: option?.seller?.services?.service_2?.image_url,
            },
            service_3: {
              title: option?.seller?.services?.service_3?.title,
              description: option?.seller?.services?.service_3?.description,
              image_url: option?.seller?.services?.service_3?.image_url,
            },
            service_4: {
              title: option?.seller?.services?.service_4?.title,
              description: option?.seller?.services?.service_4?.description,
              image_url: option?.seller?.services?.service_4?.image_url,
            },
          },
          steps: {
            status: option?.seller?.steps?.status,
            title: option?.seller?.steps?.title,
            step_1: {
              title: option?.seller?.steps?.step_1?.title,
              description: option?.seller?.steps?.step_1?.description
            },
            step_2: {
              title: option?.seller?.steps?.step_2?.title,
              description: option?.seller?.steps?.step_2?.description
            },
            step_3: {
              title: option?.seller?.steps?.step_3?.title,
              description: option?.seller?.steps?.step_3?.description
            },
          },
          start_selling :{
            status: option?.seller?.steps?.status,
            title: option?.seller?.start_selling?.title,
            description: option?.seller?.start_selling?.description
          },
          store_layout: option?.seller?.store_layout,
          store_details: option?.seller?.store_details,
          store_image_url: option?.seller?.store_image_url,
        },
        about_us: {
          about: {
            status: option?.about_us?.about?.status,
            content_left_image_url: option?.about_us?.about?.content_left_image_url,
            content_right_image_url: option?.about_us?.about?.content_right_image_url,
            sub_title: option?.about_us?.about?.sub_title,
            title: option?.about_us?.about?.title,
            description: option?.about_us?.about?.description,
            futures: option?.about_us?.about?.futures,
          },
          clients: {
            status: option?.about_us?.clients?.status,
            sub_title: option?.about_us?.clients?.sub_title,
            title: option?.about_us?.clients?.title,
            content: option?.about_us?.clients?.content,
          },
          team: {
            status: option?.about_us?.team?.status,
            sub_title: option?.about_us?.team?.sub_title,
            title: option?.about_us?.team?.title,
            members: option?.about_us?.team?.members,
          },
          testimonial: {
            status: option?.about_us?.testimonial?.status,
            sub_title: option?.about_us?.testimonial?.sub_title,
            title: option?.about_us?.testimonial?.title,
            reviews: option?.about_us?.testimonial?.reviews,
          },
          blog: {
            status: option?.about_us?.blog?.status,
            blog_ids: option?.about_us?.blog?.blog_ids,
          },
        },
        contact_us: {
          contact_image_url: option?.contact_us?.contact_image_url,
          detail_1: {
            label: option?.contact_us?.detail_1?.label,
            icon: option?.contact_us?.detail_1?.icon,
            text: option?.contact_us?.detail_1?.text,
          },
          detail_2: {
            label: option?.contact_us?.detail_2?.label,
            icon: option?.contact_us?.detail_2?.icon,
            text: option?.contact_us?.detail_2?.text,
          },
          detail_3: {
            label: option?.contact_us?.detail_3?.label,
            icon: option?.contact_us?.detail_3?.icon,
            text: option?.contact_us?.detail_3?.text,
          },
          detail_4: {
            label: option?.contact_us?.detail_4?.label,
            icon: option?.contact_us?.detail_4?.icon,
            text: option?.contact_us?.detail_4?.text,
          },
        },
        error_page: {
          error_page_content: option?.error_page?.error_page_content,
          back_button_enable: option?.error_page?.back_button_enable,
          back_button_text: option?.error_page?.back_button_text,
        },
        collection: {
          collection_layout: option?.collection?.collection_layout,
          collection_banner_image_url: option?.collection?.collection_banner_image_url,
        },
        product: {
          product_layout: option?.product?.product_layout,
          product_box_variant: option?.product?.product_box_variant,
          image_bg: option?.product?.image_bg,
          product_box_bg: option?.product?.product_box_bg, 
          product_box_border: option?.product?.product_box_border,
          full_border: option?.product?.full_border,
          is_trending_product: option?.product?.is_trending_product,
          banner_enable: option?.product?.banner_enable,
          banner_image_url: option?.product?.banner_image_url,
          safe_checkout: option?.product?.safe_checkout,
          safe_checkout_image: option?.product?.safe_checkout_image,
          secure_checkout: option?.product?.secure_checkout,
          secure_checkout_image: option?.product?.secure_checkout_image,
          encourage_order: option?.product?.encourage_order,
          encourage_max_order_count: option?.product?.encourage_max_order_count,
          encourage_view: option?.product?.encourage_view,
          encourage_max_view_count: option?.product?.encourage_max_view_count,
          sticky_checkout: option?.product?.sticky_checkout,
          sticky_product: option?.product?.sticky_product,
          social_share: option?.product?.social_share,
          shipping_and_return: option?.product?.shipping_and_return,
        },
        popup: {
          news_letter: {
            is_enable: option?.popup?.news_letter?.is_enable, 
            image_url: option?.popup?.news_letter?.image_url,
            offer: option?.popup?.news_letter?.offer, 
            title: option?.popup?.news_letter?.title,
            description: option?.popup?.news_letter?.description,
          },
          exit: {
            is_enable: option?.popup?.exit?.is_enable, 
            image_url: option?.popup?.exit?.image_url,
            title: option?.popup?.exit?.title,
            sub_title : option?.popup?.exit?.sub_title,
            description: option?.popup?.exit?.description,
          },
        },
      });

      setTimeout(() => {
        this.renderer.addClass(this.document.body, 'loader-none');
        this.store.dispatch(new GetProducts(this.filter)).subscribe({
          complete: () => {
            this.form.patchValue({
              header: {
                today_deals: option?.header?.today_deals,
              }
            });
          }
        });
      }, 500);
      this.renderer.removeClass(this.document.body, 'loader-none');

      this.futuresContent.clear();
      option?.about_us?.about?.futures?.forEach((future: AboutFutures)=>{
        this.futuresContent?.push(
          this.formBuilder.group({
          icon: new FormControl(future?.icon),
          title: new FormControl(future?.title),
        }))
      })

      this.clientsContent.clear();
      option?.about_us?.clients?.content?.forEach((content: ClientsContent)=>{
        this.clientsContent.push(
          this.formBuilder.group({
            icon: new FormControl(content.icon),
            title: new FormControl(content.title),
            description: new FormControl(content.description),
        }))
      })

      this.members.clear();
      option?.about_us?.team?.members?.forEach((member: Member)=>{
        this.members.push(
          this.formBuilder.group({
            profile_image_url: new FormControl(member.profile_image_url),
            name: new FormControl(member.name),
            designation: new FormControl(member.designation),
            description: new FormControl(member.description),
            instagram: new FormControl(member.instagram),
            twitter: new FormControl(member.twitter),
            pinterest: new FormControl(member.pinterest),
            facebook: new FormControl(member.facebook),
        }))
      })

      this.testimonials.clear();
      option?.about_us?.testimonial?.reviews?.forEach((review: Review)=>{
        this.testimonials.push(
          this.formBuilder.group({
            title: new FormControl(review.name),
            profile_image_url: new FormControl(review.profile_image_url),
            name: new FormControl(review.name),
            review: new FormControl(review.review),
            designation: new FormControl(review.designation),
        }))
      })
    });
  }

  get taglines() {
    return this.form.get('general.taglines') as FormArray;
  }
  
  get topBarContent(): FormArray {
    return this.form.get('header.top_bar_content') as FormArray;
  }

  get futuresContent(): FormArray {
    return this.form.get('about_us.about.futures') as FormArray;
  }

  get clientsContent(): FormArray {
    return this.form.get('about_us.clients.content') as FormArray;
  }

  get members(): FormArray {
    return this.form.get('about_us.team.members') as FormArray;
  }

  get testimonials(): FormArray {
    return this.form.get('about_us.testimonial.reviews') as FormArray;
  }

  initializeForm(value: TopBarContent[]) {
    this.top_bar_content.forEach(item => {
      const group = this.formBuilder.group({
        content: item.content
      });
      this.topBarContent.push(group);
    });
  }

  addFuture(event: Event){
    event.preventDefault();
    this.futuresContent.push(
      this.formBuilder.group({
        icon: new FormControl(''),
        title: new FormControl(''),
      })
    );
  }

  addClientsContent(event: Event){
    event.preventDefault();
    this.clientsContent.push(
      this.formBuilder.group({
        icon: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
      })
    );
  }
 
  addMember(event: Event){
    event.preventDefault();
    this.members.push(
      this.formBuilder.group({
        profile_image_url: new FormControl(''),
        name: new FormControl(''),
        designation: new FormControl(''),
        description: new FormControl(''),
        instagram: new FormControl(''),
        twitter: new FormControl(''),
        pinterest: new FormControl(''),
        facebook: new FormControl(''),
      })
    );
  }

  reviews(event: Event){
    event.preventDefault();
    this.testimonials.push(
      this.formBuilder.group({
        title: new FormControl(''),
        profile_image_url: new FormControl(''),
        name: new FormControl(''),
        designation: new FormControl(''),
        review: new FormControl(''),
      })
    );
  }

  selectHeaderLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['logo']).controls['header_logo_id'].setValue(data ? data?.id : null);
    }
  }

  selectFooterLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['logo']).controls['footer_logo_id']?.setValue(data ? data?.id : null);
    }
  }

  selectFaviconIcon(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['logo']).controls['favicon_icon_id']?.setValue(data ? data?.id : null);
    }
  }

  selectOgImage(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['seo']).controls['og_image_id']?.setValue(data ? data?.id : null);
    }
  }
  
  selectSellerImage(data: string, key: string) {
    if(!Array.isArray(data)) {
      this.form.get(key)?.setValue(data ? data : null);
    }
  }

  usefulLink(data: number[]){
    if(Array.isArray(data)) {
      (<FormGroup>this.form.controls['footer']).controls['useful_link']?.setValue(this.useful_link.filter(value => data.includes(value.id)));
    }
  }

  helpCenter(data: number[]){
    if(Array.isArray(data)) {
      (<FormGroup>this.form.controls['footer']).controls['help_center']?.setValue(this.help_center.filter(value => data.includes(value.id)));
    }
  }

  selectCategory(data: []) {
    if(Array.isArray(data)) {
      (<FormGroup>this.form.controls['footer']).controls['footer_categories']?.setValue(data);
    }
  }

  selectBanner(url: string, key: string) {
    this.form.get(key)?.setValue(url ? url : null);
  }

  selectFutures(url: string, index: number){
    this.futuresContent.at(index).get('icon')?.setValue(url ? url : null);
  }

  selectIcon(url: string, index: number){
    this.clientsContent.at(index).get('icon')?.setValue(url ? url : null);
  }

  selectMemberProfile(url: string, index: number){
    this.members.at(index).get('profile_image_url')?.setValue(url ? url : null);
  }

  selectReviewProfile(url: string, index: number){
    this.testimonials.at(index).get('profile_image_url')?.setValue(url ? url : null);
  }

  removeFutures(index: number) {
    if(this.futuresContent.length <= 0) return
      this.futuresContent.removeAt(index);
  }

  removeMember(index: number) {
    if(this.members.length <= 0) return
      this.members.removeAt(index);
  }

  removeClient(index: number) {
    if(this.clientsContent.length <= 0) return
      this.clientsContent.removeAt(index);
  }

  removeProfile(index: number) {
    if(this.testimonials.length <= 0) return
      this.testimonials.removeAt(index);
  }

  selectCategoryItem(data: Number[], key: string) {
    if(Array.isArray(data)) {
      this.form.get(key)?.setValue(data);
    }
  }

  submit() {
    this.store.dispatch(new UpdateThemeOption({options: this.form.value}));
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }

}
