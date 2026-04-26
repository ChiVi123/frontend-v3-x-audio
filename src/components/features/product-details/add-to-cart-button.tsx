'use client';

import { Button } from '~/components/ui/button';

/**
 * AddToCartButton — Isolated Client Component for the cart action.
 *
 * Extracted so that the rest of ProductInfoPanel can remain a
 * Server Component. Only this button needs client interactivity.
 */
interface AddToCartButtonProps {
  productId: string;
  productName: string;
}

function AddToCartButton({ productId, productName }: AddToCartButtonProps) {
  const handleClick = () => {
    // TODO: dispatch to cart state / call server action
    console.log('Add to cart:', productId);
  };

  return (
    <Button
      variant="gold"
      size="lg"
      className="w-full font-mono text-[11px] uppercase tracking-widest"
      onClick={handleClick}
      aria-label={`Add ${productName} to cart`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Add to Cart
    </Button>
  );
}

export { AddToCartButton };
