import { Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gradient mb-3">
              Multi-Agent Workflow Automator
            </h3>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Transform your marketing workflow with AI-powered multi-agent automation. 
              From product concept to complete marketing brief in minutes.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-neon-blue transition-colors" />
              </a>
              <a 
                href="https://github.com/ayush-kumar-sahu-07" 
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-neon-blue transition-colors" />
              </a>
              <a 
                href="https://www.linkedin.com/in/ayush-kumar-sahu-1b212438b/" 
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-neon-blue transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Multi-Agent Workflow Automator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
