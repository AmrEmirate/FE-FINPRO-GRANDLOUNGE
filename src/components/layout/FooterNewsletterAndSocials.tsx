// src/components/layout/FooterNewsletterAndSocials.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { socialLinks } from "@/lib/constants/footer-data";

export const FooterNewsletterAndSocials = () => (
    <div>
      <h3 className="text-lg font-semibold mb-5 tracking-wide">Stay Updated</h3>
      <p className="text-gray-400 mb-4 text-sm">
        Get the latest deals and property news delivered to your inbox.
      </p>
      <form className="flex w-full max-w-sm items-center space-x-2">
        <Input 
          type="email" 
          placeholder="Your email address" 
          className="bg-gray-800 border-gray-700 text-white" 
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <div className="mt-8">
        <h4 className="text-md font-semibold mb-4 tracking-wide">Follow Us</h4>
        <div className="flex space-x-5">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a key={label} href={href} aria-label={label} className="text-gray-400 hover:text-white">
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
);