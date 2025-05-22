'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { IoMdClose } from 'react-icons/io';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import productService, { Product } from '@/services/product';
import ProductCard from '../ui/ProductCard';
import Link from 'next/link';

export default function SearchPopup() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setProducts([]);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getProducts({ search: searchQuery });
                setProducts(response?.data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(fetchProducts, 300); // Debounce search
        return () => clearTimeout(debounceTimeout);
    }, [searchQuery]);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button
                    aria-label="Search"
                    className="hover:opacity-70 transition-opacity"
                >
                    <FiSearch size={18} />
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <Dialog.Title className="sr-only"></Dialog.Title>
                <Dialog.Content
                    className="fixed top-0 left-0 right-0 bg-white z-50 max-h-[95vh] overflow-y-auto shadow-lg border-b border-gray-200"
                >
                    <div className="py-3 px-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Link href="/" className="mb-4 sm:mb-0">
                                <Image
                                    src="/images/logo/logo_black.png"
                                    alt="Forvr Murr"
                                    width={180}
                                    height={60}
                                    className="h-auto w-auto"
                                />
                            </Link>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:max-w-xl border-b-2 text-black border-yellow-500 focus:outline-none py-3"
                            />
                            <Dialog.Close asChild>
                                <button aria-label="Close" className="mt-2 sm:mt-0">
                                    <IoMdClose size={34} />
                                </button>
                            </Dialog.Close>
                        </div>

                        {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

                        {!loading && products.length > 0 && (
                            <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                                {products?.map((product, index) => (
                                    <ProductCard key={product.id} product={product} priorityLoading={index < 4} />
                                ))}
                            </div>
                        )}

                        {!loading && products.length === 0 && searchQuery.trim() !== '' && (
                            <p className="text-center text-gray-500 mt-4">No products found.</p>
                        )}

                        {!loading && products.length === 0 && searchQuery.trim() === '' && (
                            <div className="relative h-[300px] sm:h-[500px] w-full flex items-center justify-center bg-black bg-opacity-70 text-center mt-6">
                                <div className="absolute inset-0">
                                    <img
                                        src="/brand-background.svg"
                                        alt="Perfume background"
                                        className="object-cover w-full h-full blur-sm opacity-30"
                                    />
                                </div>

                                <div className="relative z-10 max-w-2xl px-4">
                                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#E9B873] leading-snug cinzel-font">
                                        PERFUME IS PERSONAL.
                                        <br />
                                        LET’S GET YOURS RIGHT
                                    </h1>
                                    <p className="text-[#E9B873] leading-[23px] mt-4 sm:mt-6 text-lg sm:text-2xl libre-baskerville-regular">
                                        Let your preferences guide your perfume journey. Take our quiz to uncover which mood, vibe, and fragrance tier (Prime or Premium) best suits you.
                                    </p>
                                    <button className="mt-4 sm:mt-6 bg-[#8B0000] hover:bg-[#8e1413] text-white py-2 sm:py-3 px-6 sm:px-8 rounded-[12px] text-sm font-medium transition duration-300">
                                        Start the Quiz
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
