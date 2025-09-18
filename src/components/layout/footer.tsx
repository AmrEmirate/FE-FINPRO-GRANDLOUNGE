import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-3.3 1.4c-1.4 0-2.8-.5-4.2-1.2l-2.8-.7c-1.4-.3-2.8-.3-4.2 0l-2.8.7c-1.8.5-3.3 0-3.3-1.4s1.7-3 3.3-4.4c-1.3-1.3-2-3.4-2-3.4s1.4-1.4 3.3-1.4c1.4 0 2.8.5 4.2 1.2l2.8.7c1.4.3 2.8.3 4.2 0l2.8-.7c1.8-.5 3.3 0 3.3 1.4z" />
    </svg>
);


export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/" className="flex items-center">
                <img src="/assets/LONGE.png" alt="Logo" className="h-12 w-auto" />
              </Link>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Your trusted partner for finding the perfect accommodation. Experience comfort and luxury in every stay.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">info@grandlodge.com</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5 tracking-wide">Popular Destinations</h3>
            <ul className="space-y-3">
              <li><Link href="/properties?category=Vila&location=Bali" className="text-gray-400 hover:text-white transition-colors text-sm">Vila in Bali</Link></li>
              <li><Link href="/properties?category=Hotel&location=Jakarta" className="text-gray-400 hover:text-white transition-colors text-sm">Hotel in Jakarta</Link></li>
              <li><Link href="/properties?category=Apartemen&location=Bandung" className="text-gray-400 hover:text-white transition-colors text-sm">Apartment in Bandung</Link></li>
              <li><Link href="/properties?category=Vila&location=Yogyakarta" className="text-gray-400 hover:text-white transition-colors text-sm">Vila in Yogyakarta</Link></li>
              <li><Link href="/properties?category=Hotel&location=Surabaya" className="text-gray-400 hover:text-white transition-colors text-sm">Hotel in Surabaya</Link></li>
              <li><Link href="/properties?category=Apartemen&location=Surabaya" className="text-gray-400 hover:text-white transition-colors text-sm">Apartment in Surabaya</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-gray-400 hover:text-white transition-colors text-sm">All Properties</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link href="/auth/register?type=tenant" className="text-gray-400 hover:text-white transition-colors text-sm">List Your Property</Link></li>
              <li><Link href="/auth/login?type=tenant" className="text-gray-400 hover:text-white transition-colors text-sm">Tenant Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5 tracking-wide">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest deals and property news delivered to your inbox.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-8">
                <h4 className="text-md font-semibold mb-4 tracking-wide">Follow Us</h4>
                <div className="flex space-x-5">
                    <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon/></a>
                    <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon/></a>
                    <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon/></a>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Grand Lodge. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}