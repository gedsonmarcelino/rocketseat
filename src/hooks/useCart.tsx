import {
  createContext,
  ReactNode,
  useContext,
  useState
  } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const LOCALSTORAGE_KEY = '@RocketShoes:cart'

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(LOCALSTORAGE_KEY)

    if (storagedCart && storagedCart !== 'undefined') {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const setLocalStorage = (cart: Product[]) => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cart))
  }

  const addProduct = async (productId: number) => {
    try {
      const stockData = await api.get(`/stock/${productId}`)
      const productOnCart = cart.find(product => product.id === productId)

      if (productOnCart === undefined) {
        const productData = await api.get(`/products/${productId}`)
        const newCart = [...cart, { ...productData.data, amount: 1 }]
        setCart(newCart)
        setLocalStorage(newCart)
      } else if (productOnCart && productOnCart.amount < stockData.data.amount) {
        const newCart = cart.map(item => {
          if (item.id === productId) {
            return {
              ...item,
              amount: item.amount + 1
            }
          }
          return item
        })
        setCart(newCart)
        setLocalStorage(newCart)
      } else {
        toast.error('Quantidade solicitada fora de estoque')
      }
    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const item = cart.find(item => item.id === productId)
      if (!item) throw new Error("");

      const newCart = cart.filter(item => item.id !== productId)
      setCart(newCart)
      setLocalStorage(newCart)
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const stockData = await api.get(`/stock/${productId}`)

      if (amount > 0 && amount < stockData.data.amount) {
        const newCart = cart.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              amount
            }
          }
          return product
        })
        setCart(newCart)
        setLocalStorage(newCart)
      } else {
        toast.error('Quantidade solicitada fora de estoque')
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
