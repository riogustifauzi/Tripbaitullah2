export type PackageDisplayOrder = 'newest' | 'random'

export interface Settings {
  id: number
  siteName: string
  pageTitle: string
  logo: string
  favicon: string
  footerLogo: string
  footerAbout: string
  footerPhone: string
  footerEmail: string
  footerAddress: string
  footerCopyright: string
  packageDisplayOrder: PackageDisplayOrder
  createdAt: string
  updatedAt: string
}

export interface SettingsFormData {
  siteName: string
  pageTitle: string
  logo: string
  favicon: string
  footerLogo: string
  footerAbout: string
  footerPhone: string
  footerEmail: string
  footerAddress: string
  footerCopyright: string
  packageDisplayOrder: PackageDisplayOrder
}
