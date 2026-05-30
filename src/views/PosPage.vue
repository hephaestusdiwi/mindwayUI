<template>
  <div class="flex h-[calc(100vh-64px)] -m-6 overflow-hidden pos-root">

    <!-- ══════ LEFT — PRODUK ══════ -->
    <div class="flex-1 flex flex-col overflow-hidden" style="background:#f0f4f8;">

      <!-- Topbar -->
      <div class="bg-white shrink-0 topbar-shadow">

        <!-- Row 1: Search + kasir info -->
        <div class="px-5 pt-3.5 pb-2.5 flex items-center gap-4">
          <div class="relative flex-1 max-w-sm">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#cbd5e1" stroke-width="1.8"/>
              <path d="M11 11l3 3" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <input v-model="search" type="text" placeholder="Cari nama produk atau SKU..."
              class="w-full pl-9 pr-4 py-2 text-sm outline-none transition-all"
              style="background:transparent; border-bottom:1.5px solid #e2e8f0; color:#1e293b; border-radius:0;"
              @focus="e => (e.target as HTMLInputElement).style.borderBottomColor='#117c6f'"
              @blur="e => (e.target as HTMLInputElement).style.borderBottomColor='#e2e8f0'"
              @input="debouncedSearch" />
            <button v-if="search" @click="search = ''; debouncedSearch()"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
              style="background:#f1f5f9; color:#94a3b8;">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="flex-1"></div>
          <div class="flex items-center gap-2.5 shrink-0">
            <div class="text-right">
              <p class="text-[10px] text-gray-400 leading-none">Kasir</p>
              <p class="text-xs font-bold text-gray-800 mt-0.5 leading-none">{{ cashierName }}</p>
            </div>
            <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0 flex-shrink-0"
              style="background:linear-gradient(135deg,#117c6f,#0d6659);">
              <img
                v-if="authStore.user?.avatar_url"
                :src="authStore.user.avatar_url"
                :alt="cashierName"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ cashierName.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="w-px h-5 bg-gray-100"></div>
            <div class="text-right">
              <p class="text-[10px] text-gray-400 leading-none">Produk</p>
              <p class="text-xs font-bold text-gray-700 mt-0.5 leading-none">{{ products.length }}</p>
            </div>
          </div>
        </div>

        <!-- Row 2: Category tabs -->
        <div class="flex items-center gap-0 overflow-x-auto scrollbar-hide px-5">
          <button
            class="px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all shrink-0 relative"
            :style="selectedCategory === ''
              ? 'color:#117c6f; border-bottom:2px solid #117c6f;'
              : 'color:#94a3b8; border-bottom:2px solid transparent;'"
            @click="selectCategory('')">
            Semua
          </button>
          <button v-for="cat in categories" :key="cat.id"
            class="px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5"
            :style="selectedCategory === cat.id
              ? 'color:#117c6f; border-bottom:2px solid #117c6f;'
              : 'color:#94a3b8; border-bottom:2px solid transparent;'"
            @click="selectCategory(cat.id)">
            <span v-if="cat.color" class="w-1.5 h-1.5 rounded-full shrink-0"
              :style="{ backgroundColor: selectedCategory === cat.id ? '#117c6f' : cat.color }"></span>
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Grid produk -->
      <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <div v-for="i in 10" :key="i" class="bg-white rounded-2xl overflow-hidden">
            <div class="aspect-square bg-gray-100 animate-pulse"></div>
            <div class="p-3 space-y-2">
              <div class="h-2.5 bg-gray-100 rounded animate-pulse"></div>
              <div class="h-2.5 bg-gray-100 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
        <div v-else-if="!products.length" class="flex flex-col items-center justify-center h-full">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M4 7l10-4 10 4v11l-10 6-10-6V7z" stroke="#cbd5e1" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-400">Produk tidak ditemukan</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <button v-for="product in products" :key="product.id"
            class="product-card text-left relative group"
            :class="{
              'is-active': getCartQty(product.id) > 0,
              'is-sold-out': product.stock === 0
            }"
            :disabled="product.stock === 0"
            @click="addToCart(product)">

            <!-- Gambar -->
            <div class="product-img-wrap">
              <img v-if="product.image_url" :src="product.image_url" :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 7l10-4 10 4v11l-10 6-10-6V7z" stroke="#e2e8f0" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </div>

              <!-- Badge diskon -->
              <span v-if="product.discount_price" class="badge-disc">DISC</span>

              <!-- Badge qty di cart -->
              <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-50" leave-active-class="transition-all duration-150" leave-to-class="opacity-0 scale-50">
                <span v-if="getCartQty(product.id) > 0" class="badge-qty">
                  {{ getCartQty(product.id) }}
                </span>
              </Transition>

              <!-- Overlay habis -->
              <div v-if="product.stock === 0" class="sold-out-overlay">Habis</div>
            </div>

            <!-- Info -->
            <div class="product-info">
              <p class="product-name">{{ product.name }}</p>

              <div class="price-row">
                <span class="price-main">{{ formatShort(product.effective_price) }}</span>
                <span v-if="product.discount_price" class="price-orig">{{ formatShort(product.price) }}</span>
              </div>

              <!-- Stock bar -->
              <div class="stock-row">
                <div class="stock-bar-bg">
                  <div class="stock-bar"
                    :style="{
                      width: Math.min((product.stock / 50) * 100, 100) + '%',
                      background: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#117c6f'
                    }">
                  </div>
                </div>
                <span class="stock-label"
                  :style="{ color: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '' }">
                  {{ product.stock }} stok
                </span>
              </div>
            </div>

            <!-- Tombol + -->
            <button v-if="product.stock > 0" class="btn-add-product" @click.stop="addToCart(product)">+</button>

          </button>
        </div>

      </div>
    </div>

    <!-- ══════ RIGHT — CART + PAYMENT ══════ -->
    <div class="w-[340px] xl:w-[380px] shrink-0 flex flex-col bg-white cart-panel">

      <!-- Header -->
      <div class="px-5 py-4 shrink-0 cart-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center cart-icon-bg">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M1 1h2l2.5 8h7L14 4H4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="7" cy="13.5" r="1" fill="white"/>
                <circle cx="12" cy="13.5" r="1" fill="white"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900 leading-none">Pesanan Baru</p>
              <p class="text-[10px] text-gray-400 mt-0.5">{{ totalItems }} item · {{ formatCurrency(grandTotal) }}</p>
            </div>
          </div>
          <button v-if="cart.length > 0"
            class="text-[11px] font-semibold text-red-400 hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
            @click="clearCart">Kosongkan</button>
        </div>
      </div>

      <!-- Cart items -->
      <div class="flex-1 overflow-y-auto scrollbar-hide">
        <div v-if="!cart.length" class="flex flex-col items-center justify-center h-full text-center px-8">
          <div class="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-100" style="background:#f8fafc;">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path d="M3 3h4l5 17h14L29 8H7" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="13" cy="27" r="1.5" fill="#cbd5e1"/>
              <circle cx="23" cy="27" r="1.5" fill="#cbd5e1"/>
            </svg>
          </div>
          <p class="text-sm font-bold text-gray-400">Keranjang masih kosong</p>
          <p class="text-xs text-gray-300 mt-1.5">Pilih produk dari kiri untuk mulai</p>
        </div>

        <div v-else class="py-2">
          <TransitionGroup name="cart" tag="div" class="space-y-0.5 px-3">
            <div v-for="(item, idx) in cart" :key="item.product_id"
              class="group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:bg-gray-50">
              <span class="text-[10px] font-bold text-gray-300 w-4 shrink-0 text-center">{{ idx + 1 }}</span>
              <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style="background:#f1f5f9;">
                <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover"/>
                <span v-else class="text-xs font-bold text-gray-300">{{ item.name.charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-800 truncate">{{ item.name }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ formatShort(item.price) }} / pcs</p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button class="w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90 border"
                  style="border-color:#e2e8f0; color:#94a3b8;"
                  @click.stop="decreaseQty(item)">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <span class="text-xs font-bold text-gray-900 w-6 text-center tabular-nums">{{ item.qty }}</span>
                <button class="w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90"
                  style="background:#117c6f; color:white;"
                  @click.stop="increaseQty(item)">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
              </div>
              <div class="text-right shrink-0 w-16">
                <p class="text-xs font-bold text-gray-900">{{ formatShort(item.price * item.qty) }}</p>
                <button class="text-[9px] text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  @click.stop="removeFromCart(item.product_id)">hapus</button>
              </div>
            </div>
          </TransitionGroup>

          <div class="mx-4 my-2 border-t border-dashed border-gray-100"></div>

          <!-- Diskon -->
          <div class="mx-3 mb-1">
            <div class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style="background:#f8fafc; border:1.5px solid #e2e8f0;">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M14 2L2 14M5.5 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM10.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" stroke="#94a3b8" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <span class="text-xs text-gray-400 shrink-0">Diskon</span>
              <div class="relative flex-1">
                <span class="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Rp</span>
                <input :value="formatRupiah(String(globalDiscount))" type="text" inputmode="numeric" placeholder="0"
                  class="w-full pl-5 text-xs font-semibold text-gray-800 bg-transparent outline-none text-right"
                  @input="handleDiscountInput" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ PAYMENT SECTION ══ -->
      <div class="shrink-0 payment-section">

        <!-- Price breakdown -->
        <div class="px-5 pt-3 pb-2 space-y-1.5">
          <div class="flex justify-between text-xs text-gray-400">
            <span>Subtotal ({{ totalItems }} item)</span>
            <span class="font-medium text-gray-600">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div v-if="globalDiscount > 0" class="flex justify-between text-xs">
            <span class="text-gray-400">Diskon</span>
            <span class="font-semibold text-red-500">− {{ formatCurrency(globalDiscount) }}</span>
          </div>
        </div>

        <!-- Grand total -->
        <div class="mx-5 mb-3 px-4 py-3 rounded-2xl flex items-center justify-between grand-total-box">
          <div>
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Total Bayar</p>
            <p class="text-xl font-black mt-0.5 total-amount">{{ formatCurrency(grandTotal) }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-400">{{ totalItems }} item</p>
            <div class="flex items-center gap-1 mt-1">
              <div class="w-1.5 h-1.5 rounded-full" style="background:#117c6f;"></div>
              <span class="text-[10px] font-semibold" style="color:#117c6f;">mindwayPOS</span>
            </div>
          </div>
        </div>

        <!-- ══ PAYMENT METHOD — NEW DESIGN ══ -->
        <div class="px-5 mb-3">
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2.5">Metode Pembayaran</p>

          <!-- Tab selector: Tunai / Transfer / E-Wallet / QRIS -->
          <div class="flex gap-1.5 mb-3 p-1 rounded-xl payment-tab-bg">
            <button v-for="tab in paymentTabs" :key="tab.value"
              class="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 flex flex-col items-center gap-0.5"
              :style="activeTab === tab.value
                ? 'background:white; color:#117c6f; box-shadow:0 2px 8px rgba(0,0,0,0.08);'
                : 'color:#94a3b8;'"
              @click="selectTab(tab.value)">
              <span class="text-sm leading-none">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Tunai -->
          <div v-if="activeTab === 'cash'" class="space-y-2">
            <div class="flex items-center gap-2 rounded-xl px-3 py-2.5 cash-input-box">
              <span class="text-xs font-bold text-gray-400">Rp</span>
              <input :value="formatRupiah(String(cashPaid || ''))" type="text" inputmode="numeric" placeholder="Jumlah uang diterima"
                class="flex-1 text-sm font-bold text-gray-900 bg-transparent outline-none"
                @input="handleCashInput" />
              <button v-if="cashPaid > 0" @click="cashPaid = 0" class="text-gray-300 hover:text-gray-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1.5">
              <button v-for="amt in quickAmounts" :key="amt.value"
                class="py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 quick-amount-btn"
                @click="cashPaid = amt.value">{{ amt.label }}</button>
            </div>
            <Transition enter-active-class="transition-all duration-250 ease-out" enter-from-class="opacity-0 scale-95" leave-to-class="opacity-0">
              <div v-if="cashPaid >= grandTotal && grandTotal > 0"
                class="flex items-center justify-between rounded-xl px-4 py-2.5 change-box">
                <div class="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#10b981"/>
                    <path d="M4 7l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="text-xs font-bold text-emerald-700">Kembalian</span>
                </div>
                <span class="text-sm font-black text-emerald-700">{{ formatCurrency(cashPaid - grandTotal) }}</span>
              </div>
            </Transition>
          </div>

          <!-- Transfer Bank -->
          <div v-else-if="activeTab === 'transfer'" class="space-y-2">
            <p class="text-[10px] text-gray-400 mb-2">Pilih bank tujuan transfer</p>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="bank in bankOptions" :key="bank.value"
                class="py-2.5 px-2 rounded-xl transition-all duration-150 flex flex-col items-center gap-1.5 border-2"
                :style="paymentMethod === bank.value
                  ? `border-color:${bank.color}; background:${bank.color}12;`
                  : 'border-color:#e2e8f0; background:#f8fafc;'"
                @click="paymentMethod = bank.value">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
                  :style="`background:${bank.color};`">
                  {{ bank.abbr }}
                </div>
                <span class="text-[9px] font-bold text-gray-600 text-center leading-tight">{{ bank.label }}</span>
              </button>
            </div>
          </div>

          <!-- E-Wallet -->
          <div v-else-if="activeTab === 'ewallet'" class="space-y-2">
            <p class="text-[10px] text-gray-400 mb-2">Pilih dompet digital</p>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="wallet in ewalletOptions" :key="wallet.value"
                class="py-2.5 px-2 rounded-xl transition-all duration-150 flex flex-col items-center gap-1.5 border-2 relative overflow-hidden"
                :style="paymentMethod === wallet.value
                  ? `border-color:${wallet.color}; background:${wallet.color}12; box-shadow:0 4px 12px ${wallet.color}30;`
                  : 'border-color:#e2e8f0; background:#f8fafc;'"
                @click="paymentMethod = wallet.value">
                <!-- Logo placeholder with brand color -->
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-[10px] leading-tight text-center"
                  :style="`background:linear-gradient(135deg, ${wallet.color}, ${wallet.colorDark});`">
                  {{ wallet.abbr }}
                </div>
                <span class="text-[9px] font-bold text-gray-600 text-center leading-tight">{{ wallet.label }}</span>
                <!-- selected check -->
                <div v-if="paymentMethod === wallet.value"
                  class="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  :style="`background:${wallet.color};`">
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-3" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </button>
            </div>
          </div>

          <!-- QRIS -->
          <div v-else-if="activeTab === 'qris'" class="space-y-2">
            <div class="rounded-2xl p-4 text-center qris-box">
              <div class="w-24 h-24 mx-auto rounded-2xl bg-white flex items-center justify-center mb-3 shadow-inner">
                <!-- QR pattern decorative -->
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="22" height="22" rx="3" stroke="#117c6f" stroke-width="2.5" fill="none"/>
                  <rect x="9" y="9" width="12" height="12" rx="1" fill="#117c6f"/>
                  <rect x="38" y="4" width="22" height="22" rx="3" stroke="#117c6f" stroke-width="2.5" fill="none"/>
                  <rect x="43" y="9" width="12" height="12" rx="1" fill="#117c6f"/>
                  <rect x="4" y="38" width="22" height="22" rx="3" stroke="#117c6f" stroke-width="2.5" fill="none"/>
                  <rect x="9" y="43" width="12" height="12" rx="1" fill="#117c6f"/>
                  <rect x="34" y="34" width="6" height="6" rx="1" fill="#117c6f"/>
                  <rect x="44" y="34" width="6" height="6" rx="1" fill="#117c6f"/>
                  <rect x="54" y="34" width="6" height="6" rx="1" fill="#117c6f"/>
                  <rect x="34" y="44" width="6" height="6" rx="1" fill="#117c6f"/>
                  <rect x="44" y="44" width="6" height="6" rx="1" fill="#117c6f"/>
                  <rect x="54" y="54" width="6" height="6" rx="1" fill="#117c6f"/>
                  <rect x="34" y="54" width="6" height="6" rx="1" fill="#117c6f"/>
                </svg>
              </div>
              <p class="text-xs font-bold text-gray-700">Scan QRIS untuk bayar</p>
              <p class="text-[10px] text-gray-400 mt-0.5">GoPay · OVO · Dana · ShopeePay · LinkAja · dan semua e-wallet</p>
              <div class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full qris-total-badge">
                <span class="text-xs font-black" style="color:#117c6f;">{{ formatCurrency(grandTotal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout button -->
        <div class="px-5 pb-5">
          <button
            class="w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2.5 relative overflow-hidden checkout-btn"
            :class="canCheckout ? 'checkout-active' : 'checkout-disabled'"
            :disabled="!canCheckout || isCheckingOut"
            @click="handleCheckout">
            <div v-if="canCheckout" class="checkout-shine"></div>
            <svg v-if="isCheckingOut" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75"/>
            </svg>
            <svg v-else-if="canCheckout" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h10M8 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ checkoutLabel }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ══════ MODAL STRUK ══════ -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
        <div v-if="showReceipt" class="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style="background:rgba(15,23,42,0.65); backdrop-filter:blur(8px);"
          @click.self="closeReceipt">
          <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95 translate-y-4" leave-to-class="opacity-0 scale-97">
            <div v-if="showReceipt" class="w-full overflow-hidden bg-white" style="max-width:380px; max-height:90vh; border-radius:24px; box-shadow:0 40px 80px rgba(0,0,0,0.2);">
              <div class="relative px-6 py-7 text-center overflow-hidden" style="background:linear-gradient(135deg,#117c6f,#0a5248);">
                <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white"></div>
                <div class="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 bg-white"></div>
                <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.25);">
                  <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l7 7L23 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="text-white font-black text-xl">Transaksi Berhasil!</p>
                <div class="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full" style="background:rgba(255,255,255,0.15);">
                  <span class="text-white/70 text-xs">No. Transaksi</span>
                  <span class="text-white font-bold text-xs">#{{ receiptId }}</span>
                </div>
              </div>
              <div class="overflow-y-auto scrollbar-hide" style="max-height:calc(90vh - 210px);">
                <div class="px-6 py-4">
                  <div class="text-center pb-4 mb-4" style="border-bottom:1.5px dashed #e2e8f0;">
                    <p class="font-black text-gray-900 text-base">mindwayPOS</p>
                    <p class="text-xs text-gray-400 mt-1">{{ receiptDate }}</p>
                    <p class="text-xs text-gray-400">Kasir: <span class="font-semibold text-gray-600">{{ cashierName }}</span></p>
                  </div>
                  <div class="space-y-3 mb-4">
                    <div v-for="item in receiptItems" :key="item.product_id" class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
                        <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover"/>
                        <span v-else class="text-[9px] font-bold text-gray-400">{{ item.name.charAt(0) }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-gray-800 truncate">{{ item.name }}</p>
                        <p class="text-[10px] text-gray-400">{{ item.qty }} × {{ formatCurrency(item.price) }}</p>
                      </div>
                      <p class="text-xs font-bold text-gray-900 shrink-0">{{ formatCurrency(item.price * item.qty) }}</p>
                    </div>
                  </div>
                  <div class="rounded-2xl p-4 space-y-2" style="background:#f8fafc; border:1.5px solid #e2e8f0;">
                    <div class="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span><span>{{ formatCurrency(receiptSubtotal) }}</span>
                    </div>
                    <div v-if="receiptDiscount > 0" class="flex justify-between text-xs font-medium text-red-500">
                      <span>Diskon</span><span>− {{ formatCurrency(receiptDiscount) }}</span>
                    </div>
                    <div class="flex justify-between font-black pt-2" style="border-top:1.5px dashed #e2e8f0;">
                      <span class="text-sm text-gray-900">Total</span>
                      <span class="text-sm" style="color:#117c6f;">{{ formatCurrency(receiptTotal) }}</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-400">
                      <span>Metode</span>
                      <span class="font-bold uppercase text-gray-600">{{ getMethodLabel(receiptMethod) }}</span>
                    </div>
                    <div v-if="receiptMethod === 'cash'" class="flex justify-between text-xs text-gray-400">
                      <span>Dibayar</span><span>{{ formatCurrency(receiptCashPaid) }}</span>
                    </div>
                    <div v-if="receiptMethod === 'cash' && receiptCashPaid > receiptTotal"
                      class="flex justify-between text-xs font-black" style="color:#117c6f;">
                      <span>Kembalian</span><span>{{ formatCurrency(receiptCashPaid - receiptTotal) }}</span>
                    </div>
                  </div>
                  <p class="text-center text-[10px] text-gray-300 mt-4">Terima kasih telah berbelanja 🙏</p>
                </div>
              </div>
              <div class="px-6 py-4 flex gap-2.5" style="border-top:1.5px solid #f1f5f9;">
                <button class="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-gray-500 hover:bg-gray-50"
                  style="border:1.5px solid #e2e8f0;"
                  @click="printReceipt">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6V2h8v4M4 12H2V7h12v5h-2M4 10h8v4H4v-4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                  </svg>
                  Cetak Struk
                </button>
                <button class="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-colors"
                  style="background:linear-gradient(135deg,#117c6f,#0d6659); box-shadow:0 4px 12px rgba(17,124,111,0.3);"
                  @click="closeReceipt">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                  Transaksi Baru
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- Thermal receipt hidden -->
  <div style="display:none;" id="thermal-receipt">
    <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;">
      <p style="font-size:11pt;font-weight:bold;margin:0;">mindwayPOS</p>
    </div>
    <div style="border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;">
      <table style="width:100%;font-size:8pt;">
        <tr><td>No</td><td style="text-align:right;">#{{ receiptId }}</td></tr>
        <tr><td>Tanggal</td><td style="text-align:right;">{{ receiptDate }}</td></tr>
        <tr><td>Kasir</td><td style="text-align:right;">{{ cashierName }}</td></tr>
      </table>
    </div>
    <div style="border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;">
      <div v-for="item in receiptItems" :key="item.product_id" style="margin-bottom:4px;">
        <p style="margin:0;font-size:8.5pt;font-weight:bold;">{{ item.name }}</p>
        <table style="width:100%;font-size:8pt;">
          <tr><td>{{ item.qty }} x {{ formatCurrency(item.price) }}</td><td style="text-align:right;">{{ formatCurrency(item.price * item.qty) }}</td></tr>
        </table>
      </div>
    </div>
    <div style="border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;">
      <table style="width:100%;font-size:8.5pt;">
        <tr><td>Subtotal</td><td style="text-align:right;">{{ formatCurrency(receiptSubtotal) }}</td></tr>
        <tr v-if="receiptDiscount>0"><td>Diskon</td><td style="text-align:right;">-{{ formatCurrency(receiptDiscount) }}</td></tr>
        <tr style="font-weight:bold;font-size:9.5pt;"><td>TOTAL</td><td style="text-align:right;">{{ formatCurrency(receiptTotal) }}</td></tr>
        <tr><td>Metode</td><td style="text-align:right;">{{ getMethodLabel(receiptMethod) }}</td></tr>
        <tr v-if="receiptMethod==='cash'"><td>Tunai</td><td style="text-align:right;">{{ formatCurrency(receiptCashPaid) }}</td></tr>
        <tr v-if="receiptMethod==='cash'&&receiptCashPaid>receiptTotal" style="font-weight:bold;"><td>Kembali</td><td style="text-align:right;">{{ formatCurrency(receiptCashPaid-receiptTotal) }}</td></tr>
      </table>
    </div>
    <div style="text-align:center;font-size:8pt;"><p>Terima kasih!</p></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'

interface Product { id: number; name: string; price: number; effective_price: number; discount_price: number | null; stock: number; image_url: string | null; category_id: number }
interface Category { id: number; name: string; color?: string }
interface CartItem { product_id: number; name: string; price: number; qty: number; image_url: string | null; max_stock: number }

const authStore   = useAuthStore()
const cashierName = computed(() => authStore.user?.name ?? 'Kasir')

const isLoading = ref(false); const isCheckingOut = ref(false); const showReceipt = ref(false)
const products = ref<Product[]>([]); const categories = ref<Category[]>([]); const cart = ref<CartItem[]>([])
const search = ref(''); const selectedCategory = ref<number | ''>(''); const activeTab = ref('cash')
const paymentMethod = ref('cash'); const cashPaid = ref(0); const globalDiscount = ref(0)

const receiptId = ref(''); const receiptDate = ref(''); const receiptItems = ref<CartItem[]>([])
const receiptTotal = ref(0); const receiptSubtotal = ref(0); const receiptDiscount = ref(0)
const receiptMethod = ref(''); const receiptCashPaid = ref(0)

// Payment Tabs
const paymentTabs = [
  { label: 'Tunai',    value: 'cash',     icon: '💵' },
  { label: 'Transfer', value: 'transfer', icon: '🏦' },
  { label: 'E-Wallet', value: 'ewallet',  icon: '📲' },
  { label: 'QRIS',     value: 'qris',     icon: '⊡' },
]

// Bank Transfer options
const bankOptions = [
  { label: 'BCA',       value: 'transfer_bca',    abbr: 'BCA',  color: '#0066AE' },
  { label: 'Mandiri',   value: 'transfer_mandiri', abbr: 'MDR',  color: '#003087' },
  { label: 'BRI',       value: 'transfer_bri',     abbr: 'BRI',  color: '#003F5A' },
  { label: 'BNI',       value: 'transfer_bni',     abbr: 'BNI',  color: '#E87722' },
  { label: 'BSI',       value: 'transfer_bsi',     abbr: 'BSI',  color: '#00843D' },
  { label: 'CIMB',      value: 'transfer_cimb',    abbr: 'CIMB', color: '#B11116' },
]

// E-Wallet options — semua e-wallet populer Indonesia
const ewalletOptions = [
  { label: 'GoPay',      value: 'ewallet_gopay',      abbr: 'GP',   color: '#00AED6', colorDark: '#008FB0' },
  { label: 'OVO',        value: 'ewallet_ovo',         abbr: 'OVO',  color: '#4C3494', colorDark: '#3A2570' },
  { label: 'Dana',       value: 'ewallet_dana',        abbr: 'DANA', color: '#118EEA', colorDark: '#0A6FBD' },
  { label: 'ShopeePay', value: 'ewallet_shopeepay',   abbr: 'SPay', color: '#EE4D2D', colorDark: '#CC3D1F' },
  { label: 'LinkAja',   value: 'ewallet_linkaja',     abbr: 'LA',   color: '#E82529', colorDark: '#C01F22' },
  { label: 'Jenius',    value: 'ewallet_jenius',      abbr: 'JNS',  color: '#00B4D8', colorDark: '#0090B0' },
  { label: 'iSaku',     value: 'ewallet_isaku',       abbr: 'iSK',  color: '#F37021', colorDark: '#D05E10' },
  { label: 'Flip',      value: 'ewallet_flip',        abbr: 'FLIP', color: '#00C9A7', colorDark: '#00A687' },
  { label: 'Sakuku',    value: 'ewallet_sakuku',      abbr: 'SKK',  color: '#0066AE', colorDark: '#004F8A' },
]

// All method labels map
const allMethodLabels: Record<string, string> = {
  cash: 'Tunai', qris: 'QRIS',
  ...Object.fromEntries(bankOptions.map(b => [b.value, b.label])),
  ...Object.fromEntries(ewalletOptions.map(e => [e.value, e.label])),
}
function getMethodLabel(val: string) { return allMethodLabels[val] ?? val }

function selectTab(tab: string) {
  activeTab.value = tab
  if (tab === 'cash')     { paymentMethod.value = 'cash'; cashPaid.value = 0 }
  else if (tab === 'qris') { paymentMethod.value = 'qris' }
  else if (tab === 'transfer') { paymentMethod.value = bankOptions[0].value }
  else if (tab === 'ewallet')  { paymentMethod.value = ewalletOptions[0].value }
}

const quickAmounts = computed(() => {
  const g = grandTotal.value

  // Tentukan pecahan uang berdasarkan total
  const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000]
  
  // Cari pecahan terkecil yang bisa menutup total
  const roundUp = (amount: number, denom: number) => Math.ceil(amount / denom) * denom

  // Generate 4 pilihan uang yang masuk akal
  const amounts = new Set<number>()
  
  // Opsi 1: bulatkan ke 5rb terdekat
  amounts.add(roundUp(g, 5000))
  // Opsi 2: bulatkan ke 10rb terdekat
  amounts.add(roundUp(g, 10000))
  // Opsi 3: bulatkan ke 50rb terdekat
  amounts.add(roundUp(g, 50000))
  // Opsi 4: bulatkan ke 100rb terdekat
  amounts.add(roundUp(g, 100000))

  // Konversi ke array, urutkan, ambil 4 terkecil
  return [...amounts]
    .filter(a => a >= g)
    .sort((a, b) => a - b)
    .slice(0, 4)
    .map(v => ({ label: formatShort(v), value: v }))
})

async function fetchProducts() {
  isLoading.value = true
  try {
    const params: any = { per_page: 100, is_active: 'true' }
    if (search.value) params.search = search.value
    if (selectedCategory.value) params.category_id = selectedCategory.value
    const { data } = await api.get('/auth/products', { params })
    products.value = data.data
  } finally { isLoading.value = false }
}
async function fetchCategories() { try { const { data } = await api.get('/auth/categories'); categories.value = data.data ?? data } catch {} }
onMounted(() => {
  console.log('USER:', authStore.user)
  fetchProducts()
  fetchCategories()
})

let st: ReturnType<typeof setTimeout>
function debouncedSearch() { clearTimeout(st); st = setTimeout(fetchProducts, 350) }
function selectCategory(id: number | '') { selectedCategory.value = id; fetchProducts() }

function addToCart(p: Product) {
  if (p.stock === 0) return
  const ex = cart.value.find(i => i.product_id === p.id)
  if (ex) { if (ex.qty < p.stock) ex.qty++; return }
  cart.value.push({ product_id: p.id, name: p.name, price: p.effective_price, qty: 1, image_url: p.image_url, max_stock: p.stock })
}
function increaseQty(item: CartItem) { if (item.qty < item.max_stock) item.qty++ }
function decreaseQty(item: CartItem) { if (item.qty > 1) item.qty--; else removeFromCart(item.product_id) }
function removeFromCart(id: number) { cart.value = cart.value.filter(i => i.product_id !== id) }
function clearCart() { cart.value = []; globalDiscount.value = 0; cashPaid.value = 0 }
function getCartQty(id: number) { return cart.value.find(i => i.product_id === id)?.qty ?? 0 }

const totalItems = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const subtotal   = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))
const grandTotal = computed(() => Math.max(subtotal.value - (globalDiscount.value || 0), 0))

const canCheckout = computed(() => {
  if (!cart.value.length) return false
  if (activeTab.value === 'cash' && cashPaid.value < grandTotal.value) return false
  return true
})
const checkoutLabel = computed(() => {
  if (!cart.value.length) return 'Pilih produk dulu'
  if (activeTab.value === 'cash' && cashPaid.value < grandTotal.value) return 'Masukkan uang bayar'
  return `Bayar ${formatCurrency(grandTotal.value)}`
})

function handleDiscountInput(e: Event) { globalDiscount.value = Number((e.target as HTMLInputElement).value.replace(/\D/g,'')) || 0 }
function handleCashInput(e: Event) { cashPaid.value = Number((e.target as HTMLInputElement).value.replace(/\D/g,'')) || 0 }
function formatRupiah(val: string) { return val ? Number(val).toLocaleString('id-ID') : '' }
function formatCurrency(val: number) { return new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(val ?? 0) }
function formatShort(val: number) { if (val >= 1_000_000) return `Rp ${(val/1_000_000).toFixed(1)}jt`; if (val >= 1_000) return `Rp ${(val/1_000).toFixed(0)}rb`; return `Rp ${val}` }

async function handleCheckout() {
  if (!canCheckout.value) return
  isCheckingOut.value = true
  try {
    const payload = {
      items: cart.value.map(i => ({ product_id: i.product_id, qty: i.qty, price: i.price, discount: 0 })),
      total_price: grandTotal.value,
      discount: globalDiscount.value || 0,
      payment_method: paymentMethod.value,
      cash_paid: activeTab.value === 'cash' ? cashPaid.value : grandTotal.value
    }
    const { data } = await api.post('/auth/transactions', payload)
    receiptId.value = String(data.data?.id ?? data.id ?? '').padStart(6, '0')
    receiptDate.value = new Date().toLocaleString('id-ID', { dateStyle:'long', timeStyle:'short' })
    receiptItems.value = [...cart.value]; receiptSubtotal.value = subtotal.value; receiptTotal.value = grandTotal.value
    receiptDiscount.value = globalDiscount.value || 0; receiptMethod.value = paymentMethod.value
    receiptCashPaid.value = activeTab.value === 'cash' ? cashPaid.value : grandTotal.value
    clearCart(); fetchProducts(); showReceipt.value = true
  } catch (err: any) { alert(err?.response?.data?.message ?? 'Transaksi gagal.') }
  finally { isCheckingOut.value = false }
}
function closeReceipt() { showReceipt.value = false }
function printReceipt() {
  const el = document.getElementById('thermal-receipt'); if (el) el.style.display = 'block'
  setTimeout(() => { window.print(); setTimeout(() => { if (el) el.style.display = 'none' }, 500) }, 100)
}
</script>

<style scoped>
/* ── Global ── */
.pos-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

/* ── Topbar ── */
.topbar-shadow { border-bottom: 1.5px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }

/* ── Cart panel ── */
.cart-panel { border-left: 1.5px solid #e8edf2; box-shadow: -4px 0 24px rgba(0,0,0,0.04); }
.cart-header { border-bottom: 1.5px solid #f1f5f9; }
.cart-icon-bg { background: linear-gradient(135deg,#117c6f,#0d6659); box-shadow: 0 4px 12px rgba(17,124,111,0.3); }

/* ── Payment section ── */
.payment-section { border-top: 1.5px solid #f1f5f9; }

/* ── Grand total box ── */
.grand-total-box { background: linear-gradient(135deg,#117c6f15,#117c6f08); border: 1.5px solid #117c6f20; }
.total-amount { color: #117c6f; letter-spacing: -0.5px; }

/* ── Payment tab ── */
.payment-tab-bg { background: #f1f5f9; }

/* ── Cash input ── */
.cash-input-box { background: #f8fafc; border: 1.5px solid #e2e8f0; }
.quick-amount-btn { background: #f1f5f9; color: #64748b; border: 1.5px solid #e8edf2; }
.quick-amount-btn:hover { background: #e2e8f0; }

/* ── Change box ── */
.change-box { background: linear-gradient(135deg,#ecfdf5,#d1fae5); border: 1.5px solid #6ee7b7; }

/* ── QRIS box ── */
.qris-box { background: linear-gradient(135deg, #f0fdf9, #f0f9ff); border: 1.5px solid #a7f3d0; }
.qris-total-badge { background: rgba(17,124,111,0.08); border: 1.5px solid rgba(17,124,111,0.2); }

/* ── Checkout button ── */
.checkout-btn { overflow: hidden; }
.checkout-active { background: linear-gradient(135deg,#117c6f,#0d6659); color: white; box-shadow: 0 8px 24px rgba(17,124,111,0.35); }
.checkout-disabled { background: #f1f5f9; color: #cbd5e1; cursor: not-allowed; }
.checkout-shine {
  position: absolute; inset: 0; opacity: 0.2;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
  transform: translateX(-100%);
  animation: shine 2.5s infinite;
}

/* ── Product Card ── */
.product-card {
  background: white;
  border-radius: 14px;
  border: 1.5px solid #f1f5f9;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s, box-shadow 0.15s;
  position: relative;
}
.product-card:hover:not(.is-sold-out) {
  border-color: #e2e8f0;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.product-card.is-active {
  border-color: #117c6f;
  box-shadow: 0 4px 20px rgba(17,124,111,0.15);
}
.product-card.is-sold-out { opacity: 0.5; cursor: not-allowed; }

.product-img-wrap {
  aspect-ratio: 1;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}

.badge-disc {
  position: absolute; top: 8px; left: 8px;
  background: #ef4444; color: white;
  font-size: 9px; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
}
.badge-qty {
  position: absolute; top: 8px; right: 8px;
  background: #117c6f; color: white;
  font-size: 10px; font-weight: 700;
  min-width: 20px; height: 20px;
  border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 5px;
  box-shadow: 0 2px 8px rgba(17,124,111,0.4);
}
.sold-out-overlay {
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.85);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #ef4444;
}

.product-info { padding: 8px 10px 10px; }
.product-name {
  font-size: 11px; font-weight: 600; color: #1e293b;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  line-height: 1.4;
}
.price-row { display: flex; align-items: center; gap: 5px; margin-top: 4px; }
.price-main { font-size: 12px; font-weight: 700; color: #117c6f; }
.price-orig { font-size: 10px; color: #94a3b8; text-decoration: line-through; }

.stock-row { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.stock-bar-bg { flex: 1; height: 3px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.stock-bar { height: 100%; border-radius: 99px; transition: width 0.3s; }
.stock-label { font-size: 10px; color: #94a3b8; white-space: nowrap; }

.btn-add-product {
  position: absolute; bottom: 10px; right: 10px;
  width: 22px; height: 22px;
  background: #117c6f; color: white;
  border: none; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 16px; line-height: 1;
  opacity: 0; transition: opacity 0.15s;
}
.product-card:hover .btn-add-product { opacity: 1; }
.product-card.is-active .btn-add-product { opacity: 1; }

/* ── Animations ── */
@keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
.cart-enter-active { transition: all 0.2s ease; }
.cart-leave-active { transition: all 0.15s ease; }
.cart-enter-from   { opacity: 0; transform: translateX(12px); }
.cart-leave-to     { opacity: 0; transform: translateX(-8px); height: 0; margin: 0; padding: 0; }
.cart-move         { transition: transform 0.2s ease; }

/* ── Scrollbar hide ── */
.scrollbar-hide { scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>