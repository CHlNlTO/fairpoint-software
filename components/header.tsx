'use client';

import { EnvVarWarning } from '@/components/ui/env-var-warning';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { cn, hasEnvVars } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  useState,
} from 'react';

// Type definitions
interface NavbarWrapperProps {
  children: ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: ReactNode;
  className?: string;
  isScrolled: boolean;
}

interface MobileNavContainerProps {
  children: ReactNode;
  className?: string;
  isScrolled: boolean;
}

interface MobileNavHeaderProps {
  children: ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: ReactNode;
  className?: string;
}

interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

type NavbarButtonProps = (
  | ComponentPropsWithoutRef<'a'>
  | ComponentPropsWithoutRef<'button'>
) & {
  href?: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
};

// Component definitions
const NavbarWrapper: React.FC<NavbarWrapperProps> = ({
  children,
  className,
}) => (
  <div className={cn('sticky inset-x-0 top-0 z-50 w-full min-h-24', className)}>
    {children}
  </div>
);

const NavBody: React.FC<NavBodyProps> = ({
  children,
  className,
  isScrolled,
}) => (
  <motion.div
    animate={{ width: isScrolled ? '55rem' : '65rem', y: isScrolled ? 10 : 20 }}
    initial={false}
    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    className={cn(
      'relative z-40 mx-auto hidden flex-row items-center justify-between self-start rounded-full p-2 lg:flex',
      'shadow-lg shadow-black/[0.03] border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90',
      className
    )}
  >
    {children}
  </motion.div>
);

const MobileNavContainer: React.FC<MobileNavContainerProps> = ({
  children,
  className,
  isScrolled,
}) => (
  <motion.div
    animate={{ y: isScrolled ? 10 : 15 }}
    initial={false}
    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    className={cn(
      'relative z-50 flex flex-col items-center justify-between rounded-xl p-2',
      'bg-slate-100 dark:bg-slate-800 shadow-xl',
      className
    )}
  >
    {children}
  </motion.div>
);

const MobileNavHeader: React.FC<MobileNavHeaderProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'flex w-full flex-row items-center justify-between',
      className
    )}
  >
    {children}
  </div>
);

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'w-full rounded-lg bg-white dark:bg-slate-900 p-4 shadow-xl flex flex-col items-start justify-start gap-4 border border-slate-200 dark:border-slate-700',
      className
    )}
  >
    {children}
  </div>
);

const NavbarLogo: React.FC = () => (
  <Link
    href="/"
    className="relative z-20 flex flex-shrink-0 items-center space-x-2 ml-6"
  >
    <div className="w-12 h-12">
      <img
        src="/logo.png"
        alt="Fairpoint Logo"
        className="w-full h-full object-contain"
      />
    </div>
  </Link>
);

const MobileNavToggle: React.FC<MobileNavToggleProps> = ({
  isOpen,
  onClick,
}) => (
  <button onClick={onClick} className="relative z-50 p-2">
    {isOpen ? (
      <X className="h-6 w-6 text-slate-900 dark:text-slate-100" />
    ) : (
      <Menu className="h-6 w-6 text-slate-900 dark:text-slate-100" />
    )}
  </button>
);

const NavbarButton: React.FC<NavbarButtonProps> = ({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const baseStyles =
    'px-4 py-2 rounded-full text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition-transform duration-200 inline-block text-center flex-shrink-0';
  const variantStyles = {
    primary: 'bg-[#38B6FF] text-white shadow-lg hover:bg-[#2BA3E6]',
    secondary:
      'bg-transparent shadow-none text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
  };

  return (
    <Tag
      href={href}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

const DesktopNavItems: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  const linkColor =
    'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
  const navItems = [
    { name: 'Features', link: '#features' },
    { name: 'Pricing', link: '/pricing' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '#contact' },
  ];

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className="flex flex-1 items-center justify-center gap-x-2"
    >
      {navItems.map((item, idx) => (
        <Link
          onMouseEnter={() => setHovered(idx)}
          key={`link-${idx}`}
          href={item.link}
          className={cn(
            'relative px-4 py-2 transition-colors duration-300',
            linkColor
          )}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered-desktop"
              className="absolute inset-0 h-full w-full rounded-full bg-slate-200 dark:bg-slate-700"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

const ActionButtons: React.FC = () => (
  <div className="flex flex-shrink-0 items-center gap-x-2 mr-6">
    <ThemeSwitch />
    {!hasEnvVars ? (
      <EnvVarWarning />
    ) : (
      <>
        <NavbarButton href="/auth/login" variant="secondary">
          Sign In
        </NavbarButton>
        <NavbarButton href="/auth/sign-up" variant="primary" as={Link}>
          Sign Up Free
        </NavbarButton>
      </>
    )}
  </div>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    setIsScrolled(latest > 10);
  });

  const navItems = [
    { name: 'Features', link: '#features' },
    { name: 'Pricing', link: '/pricing' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '#contact' },
  ];

  return (
    <NavbarWrapper>
      <NavBody isScrolled={isScrolled}>
        <NavbarLogo />
        <DesktopNavItems />
        <ActionButtons />
      </NavBody>

      <div className="w-[95%] mx-auto lg:hidden">
        <MobileNavContainer isScrolled={isScrolled}>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>
        </MobileNavContainer>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full mt-2"
            >
              <MobileNavMenu>
                {navItems.map(item => (
                  <Link
                    key={item.link}
                    href={item.link}
                    className="block w-full rounded-md p-2 text-lg font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="mt-2 flex w-full flex-col gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-center">
                    <ThemeSwitch />
                  </div>
                  {!hasEnvVars ? (
                    <EnvVarWarning />
                  ) : (
                    <>
                      <NavbarButton
                        href="/auth/login"
                        variant="secondary"
                        className="w-full text-center"
                      >
                        Sign In
                      </NavbarButton>
                      <NavbarButton
                        href="/auth/sign-up"
                        variant="primary"
                        as={Link}
                        className="w-full text-center"
                      >
                        Sign Up Free
                      </NavbarButton>
                    </>
                  )}
                </div>
              </MobileNavMenu>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NavbarWrapper>
  );
}
