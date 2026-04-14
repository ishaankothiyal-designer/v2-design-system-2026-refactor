import type { Meta } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { UIExample as AccordionUIExample } from "./Accordion.stories";
import { UIExample as BannerUIExample } from "./Banner.stories";
import { UIExample as ButtonUIExample } from "./Button.stories";
import { UIExample as CarListingUIExample } from "./CarListingMobileScreenExample";
import { UIExample as DogInventoryUIExample } from "./DogInventoryShopLandingMobileScreenExample";
import { UIExample as FoodDeliveryUIExample } from "./FoodDeliveryMobileScreenExample";
import { UIExample as FlightSearchUIExample } from "./FlightSearchMobileScreenExample";
import { UIExample as MyOrdersUIExample } from "./MyOrdersMobileScreenExample";
import { UiExample as EliteHeaderUiExample } from "./EliteHeader.stories";
import { UIExample as PhoneInputUIExample } from "./PhoneInput.stories";
import { UIExample as RegInputUIExample } from "./RegInput.stories";
import { UIExample as SwitchUIExample } from "./Switch.stories";
import { UIExample as TextInputUIExample } from "./TextInput.stories";

const meta = {
  args: {
    brand: "Cars24"
  },
  argTypes: {
    brand: {
      control: { type: "select" },
      options: STORYBOOK_BRAND_OPTIONS
    }
  },
  title: "UI Kits"
} satisfies Meta;

export default meta;

export const FAQs = {
  ...AccordionUIExample
};

export const Banner = {
  ...BannerUIExample
};

export const Button = {
  ...ButtonUIExample
};

export const CarListing = {
  ...CarListingUIExample
};

export const DogInventory = {
  ...DogInventoryUIExample
};

export const FoodDelivery = {
  ...FoodDeliveryUIExample
};

export const Flights = {
  ...FlightSearchUIExample
};

export const ElitePage = {
  ...EliteHeaderUiExample
};

export const Orders = {
  ...MyOrdersUIExample
};

export const PhoneInput = {
  ...PhoneInputUIExample
};

export const RegInput = {
  ...RegInputUIExample
};

export const Settings = {
  ...SwitchUIExample
};

export const ProfileSection = {
  ...TextInputUIExample
};
