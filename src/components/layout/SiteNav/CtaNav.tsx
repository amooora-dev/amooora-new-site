import { cn } from "@/components/utils/twMerge";
import { Menu, X } from "lucide-react";

/** Botão hambúrguer do menu mobile (abre/fecha o drawer). */
export const MenuToggleButton = ({
  open,
  setOpen,
  overDarkHero = false,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overDarkHero?: boolean;
}) => {
  return (
    <button
      type='button'
      onClick={() => setOpen((prev) => !prev)}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
      aria-controls='mobile-nav-drawer'
      className={cn(
        `flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border`,
        overDarkHero
          ? "border-white/60 bg-black/20 text-white"
          : "border-primary-27 bg-white/85 text-primary",
      )}
    >
      {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
    </button>
  );
};
