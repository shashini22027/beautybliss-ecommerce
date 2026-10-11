import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  selectCartAddToCartVersion,
  selectCartCount,
} from "../redux/slices/cartSlice";

const useCartBadgeCount = () => {
  const { pathname } = useLocation();
  const cartCount = useSelector(selectCartCount);
  const addToCartVersion = useSelector(selectCartAddToCartVersion);
  const [displayedCount, setDisplayedCount] = useState(cartCount);
  const previousAddToCartVersion = useRef(addToCartVersion);
  const isCheckout = pathname === "/checkout" || pathname === "/payment";

  useEffect(() => {
    const productAdded = addToCartVersion !== previousAddToCartVersion.current;
    if (!isCheckout || productAdded) {
      setDisplayedCount(cartCount);
    }
    previousAddToCartVersion.current = addToCartVersion;
  }, [addToCartVersion, cartCount, isCheckout]);

  return displayedCount;
};

export default useCartBadgeCount;
