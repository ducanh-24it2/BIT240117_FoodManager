import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList,
  Image, ScrollView, Alert, Switch, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const MSSV = 'BIT240117';
const TABLE_CATEGORY = `${MSSV}_DishCategory`;
const TABLE_DISH = `${MSSV}_Dish`;
const LANG_STORAGE_KEY = `${MSSV}_Language`;
const MOCK_API_URL = 'https://6714eb2b690bf212c762e6b1.mockapi.io/BIT240117_Dish';

const INITIAL_CATEGORIES = [
  { BIT240117_Id: 'cat1', BIT240117_Name: 'Main Course (Món chính)', BIT240117_Description: 'Traditional main dishes' },
  { BIT240117_Id: 'cat2', BIT240117_Name: 'Drinks (Đồ uống)', BIT240117_Description: 'Refreshing beverages' },
  { BIT240117_Id: 'cat3', BIT240117_Name: 'Dessert (Tráng miệng)', BIT240117_Description: 'Sweet desserts' },
];

const INITIAL_DISHES = [
  {
    BIT240117_Id: 'dish1',
    BIT240117_Name: 'Phở Bò Hà Nội',
    BIT240117_Price: 45000,
    BIT240117_PreparationTime: 12,
    BIT240117_IsAvailable: true,
    BIT240117_Description: 'Phở bò tái nạm nước dùng truyền thống đậm đà.',
    BIT240117_DishCategoryId: 'cat1',
    BIT240117_DishImage: [
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/pho1/400/300', BIT240117_IsThumbnail: true },
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/pho2/400/300', BIT240117_IsThumbnail: false }
    ],
    BIT240117_IsSynced: true
  },
  {
    BIT240117_Id: 'dish2',
    BIT240117_Name: 'Bún Chả Nướng',
    BIT240117_Price: 40000,
    BIT240117_PreparationTime: 20,
    BIT240117_IsAvailable: true,
    BIT240117_Description: 'Bún chả thịt nướng than hoa kèm nước chấm chua ngọt.',
    BIT240117_DishCategoryId: 'cat1',
    BIT240117_DishImage: [
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/buncha/400/300', BIT240117_IsThumbnail: true }
    ],
    BIT240117_IsSynced: true
  },
  {
    BIT240117_Id: 'dish3',
    BIT240117_Name: 'Trà Đào Cam Sả',
    BIT240117_Price: 25000,
    BIT240117_PreparationTime: 5,
    BIT240117_IsAvailable: true,
    BIT240117_Description: 'Trà đào tươi mát lạnh hương sả tự nhiên.',
    BIT240117_DishCategoryId: 'cat2',
    BIT240117_DishImage: [
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/tradao/400/300', BIT240117_IsThumbnail: true }
    ],
    BIT240117_IsSynced: true
  },
  {
    BIT240117_Id: 'dish4',
    BIT240117_Name: 'Cà Phê Sữa Đá',
    BIT240117_Price: 20000,
    BIT240117_PreparationTime: 8,
    BIT240117_IsAvailable: false,
    BIT240117_Description: 'Cà phê phin truyền thống (Hiện tạm ngừng bán).',
    BIT240117_DishCategoryId: 'cat2',
    BIT240117_DishImage: [
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/cafe/400/300', BIT240117_IsThumbnail: true }
    ],
    BIT240117_IsSynced: true
  },
  {
    BIT240117_Id: 'dish5',
    BIT240117_Name: 'Bánh Flan Caramel',
    BIT240117_Price: 15000,
    BIT240117_PreparationTime: 15,
    BIT240117_IsAvailable: true,
    BIT240117_Description: 'Bánh flan trứng sữa mềm mịn thơm mùi caramel.',
    BIT240117_DishCategoryId: 'cat3',
    BIT240117_DishImage: [
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/flan/400/300', BIT240117_IsThumbnail: true }
    ],
    BIT240117_IsSynced: true
  }
];

const TRANSLATIONS = {
  en: {
    appTitle: 'BIT240117_FoodManager',
    networkOnline: 'Online (Auto-Sync Ready)',
    networkOffline: 'Offline Mode (Saving Locally)',
    syncingMsg: 'Auto-syncing offline changes to MockAPI...',
    syncedSuccess: 'Auto-synced offline data to MockAPI successfully!',
    addDishBtn: '+ Add Dish',
    manageCatBtn: 'Categories',
    searchPlaceholder: 'Search by dish name...',
    allCategories: 'All Categories',
    availableOnly: 'Available Only',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    sortLabel: 'Sort:',
    sortNone: 'Default',
    sortPriceAsc: 'Price ↑',
    sortPriceDesc: 'Price ↓',
    sortTimeAsc: 'Time ↑',
    quickTag: 'Quick',
    regularTag: 'Regular',
    statusAvailable: 'Available',
    statusUnavailable: 'Unavailable',
    emptyList: 'No dishes found matching your criteria.',
    backBtn: '← Back',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    saveBtn: 'Save Dish',
    dishName: 'Dish Name *',
    price: 'Price (VND) *',
    prepTime: 'Preparation Time (mins) *',
    category: 'Dish Category *',
    description: 'Description',
    isAvailable: 'Currently Available for Sale',
    imagesSection: 'Dish Images (Max 1 Thumbnail)',
    imageUrlPlaceholder: 'Enter ImageUrl (https://...)',
    addImageBtn: '+ Add Image',
    setThumbnailBtn: 'Set as Thumbnail',
    thumbnailActive: '★ Thumbnail',
    noImages: 'No images available for this dish.',
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMsg: 'Are you sure you want to delete this dish?',
    cancel: 'Cancel',
    confirm: 'Delete',
    errNameEmpty: 'Validation Error: Dish Name cannot be empty!',
    errPriceInvalid: 'Validation Error: Price must be greater than 0!',
    errTimeInvalid: 'Validation Error: Preparation Time must be > 0!',
    errCategoryInvalid: 'Validation Error: Selected Category is invalid!',
    errDuplicateName: 'Validation Error: Dish name already exists in this category!',
    errPriceRange: 'Filter Error: Min price cannot be greater than Max price!',
    errNotFound: 'Error: Dish ID does not exist!',
    errCategoryInUse: 'Constraint Error: Cannot delete a category that is currently used by dishes!',
    catDeleted: 'Category deleted successfully.'
  },
  vi: {
    appTitle: 'BIT240117_FoodManager',
    networkOnline: 'Trực tuyến (Tự động đồng bộ)',
    networkOffline: 'Ngoại tuyến (Lưu vào bộ nhớ Local)',
    syncingMsg: 'Đang tự động đồng bộ dữ liệu offline lên MockAPI...',
    syncedSuccess: 'Đã tự động đồng bộ dữ liệu lên MockAPI thành công!',
    addDishBtn: '+ Thêm món',
    manageCatBtn: 'Loại món',
    searchPlaceholder: 'Tìm theo một phần tên món...',
    allCategories: 'Tất cả loại',
    availableOnly: 'Đang bán',
    minPrice: 'Giá từ',
    maxPrice: 'Đến giá',
    sortLabel: 'Sắp xếp:',
    sortNone: 'Mặc định',
    sortPriceAsc: 'Giá ↑',
    sortPriceDesc: 'Giá ↓',
    sortTimeAsc: 'TG chế biến ↑',
    quickTag: 'Nhanh',
    regularTag: 'Thông thường',
    statusAvailable: 'Đang bán',
    statusUnavailable: 'Ngừng bán',
    emptyList: 'Danh sách trống! Không tìm thấy món ăn phù hợp.',
    backBtn: '← Quay lại',
    editBtn: 'Chỉnh sửa',
    deleteBtn: 'Xóa món',
    saveBtn: 'Lưu dữ liệu',
    dishName: 'Tên món ăn *',
    price: 'Giá bán (VNĐ) *',
    prepTime: 'Thời gian chế biến (phút) *',
    category: 'Loại món ăn *',
    description: 'Mô tả chi tiết',
    isAvailable: 'Trạng thái đang mở bán',
    imagesSection: 'Danh sách ảnh (Tối đa 01 ảnh đại diện)',
    imageUrlPlaceholder: 'Nhập link ảnh ImageUrl (https://...)',
    addImageBtn: '+ Thêm ảnh',
    setThumbnailBtn: 'Đặt làm ảnh đại diện',
    thumbnailActive: '★ Ảnh đại diện',
    noImages: 'Món ăn này hiện chưa có ảnh.',
    confirmDeleteTitle: 'Xác nhận xóa',
    confirmDeleteMsg: 'Bạn có chắc chắn muốn xóa món ăn này không?',
    cancel: 'Hủy',
    confirm: 'Xóa',
    errNameEmpty: 'Lỗi kiểm tra: Tên món ăn không được để trống!',
    errPriceInvalid: 'Lỗi kiểm tra: Giá bán phải lớn hơn 0!',
    errTimeInvalid: 'Lỗi kiểm tra: Thời gian chế biến phải lớn hơn 0!',
    errCategoryInvalid: 'Lỗi kiểm tra: Loại món ăn không hợp lệ!',
    errDuplicateName: 'Lỗi trùng lặp: Tên món ăn đã tồn tại trong cùng loại món này!',
    errPriceRange: 'Lỗi bộ lọc: Giá tối thiểu không được lớn hơn giá tối đa!',
    errNotFound: 'Lỗi: Id món ăn không tồn tại!',
    errCategoryInUse: 'Ràng buộc dữ liệu: Không cho phép xóa loại món đang được sử dụng!',
    catDeleted: 'Đã xóa loại món ăn thành công.'
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  const [screen, setScreen] = useState('LIST');
  const [selectedDishId, setSelectedDishId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [isConnected, setIsConnected] = useState(true);
  const [syncBanner, setSyncBanner] = useState('');

  const [searchText, setSearchText] = useState('');
  const [filterCatId, setFilterCatId] = useState('ALL');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('NONE');

  const [editingDish, setEditingDish] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formPrepTime, setFormPrepTime] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImages, setFormImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(online);
      if (online) {
        autoSyncOfflineData();
      }
    });
    return () => unsubscribe();
  }, [dishes, lang]);

  const loadInitialData = async () => {
    try {
      const savedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang) setLang(savedLang);

      const storedCats = await AsyncStorage.getItem(TABLE_CATEGORY);
      const storedDishes = await AsyncStorage.getItem(TABLE_DISH);

      if (storedCats) {
        setCategories(JSON.parse(storedCats));
      } else {
        await AsyncStorage.setItem(TABLE_CATEGORY, JSON.stringify(INITIAL_CATEGORIES));
        setCategories(INITIAL_CATEGORIES);
      }

      if (storedDishes) {
        setDishes(JSON.parse(storedDishes));
      } else {
        await AsyncStorage.setItem(TABLE_DISH, JSON.stringify(INITIAL_DISHES));
        setDishes(INITIAL_DISHES);
      }
    } catch (error) {
      Alert.alert('Storage Error', error.message);
    }
  };

  const toggleLanguage = async () => {
    const nextLang = lang === 'en' ? 'vi' : 'en';
    setLang(nextLang);
    await AsyncStorage.setItem(LANG_STORAGE_KEY, nextLang);
  };

  const autoSyncOfflineData = async () => {
    try {
      const rawDishes = await AsyncStorage.getItem(TABLE_DISH);
      if (!rawDishes) return;
      const currentDishes = JSON.parse(rawDishes);
      const unsynced = currentDishes.filter(d => !d.BIT240117_IsSynced);

      if (unsynced.length === 0) return;

      setSyncBanner(TRANSLATIONS[lang].syncingMsg);

      const updatedDishes = [...currentDishes];
      for (let i = 0; i < updatedDishes.length; i++) {
        if (!updatedDishes[i].BIT240117_IsSynced) {
          try {
            const res = await fetch(MOCK_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedDishes[i])
            });
            if (res.ok) {
              updatedDishes[i].BIT240117_IsSynced = true;
            }
          } catch (apiErr) {}
        }
      }

      await AsyncStorage.setItem(TABLE_DISH, JSON.stringify(updatedDishes));
      setDishes(updatedDishes);
      setSyncBanner(TRANSLATIONS[lang].syncedSuccess);
      setTimeout(() => setSyncBanner(''), 4000);
    } catch (err) {
      setSyncBanner('');
    }
  };

  const openAddForm = () => {
    setEditingDish(null);
    setFormName('');
    setFormPrice('');
    setFormPrepTime('');
    setFormDesc('');
    setFormIsAvailable(true);
    setFormCategoryId(categories[0]?.BIT240117_Id || '');
    setFormImages([
      { BIT240117_ImageUrl: 'https://picsum.photos/seed/newdish/400/300', BIT240117_IsThumbnail: true }
    ]);
    setNewImageUrl('');
    setScreen('FORM');
  };

  const openEditForm = (dish) => {
    if (!dish) {
      Alert.alert('Error', t.errNotFound);
      return;
    }
    setEditingDish(dish);
    setFormName(dish.BIT240117_Name);
    setFormPrice(String(dish.BIT240117_Price));
    setFormPrepTime(String(dish.BIT240117_PreparationTime));
    setFormDesc(dish.BIT240117_Description || '');
    setFormIsAvailable(dish.BIT240117_IsAvailable);
    setFormCategoryId(dish.BIT240117_DishCategoryId);
    setFormImages(dish.BIT240117_DishImage ? [...dish.BIT240117_DishImage] : []);
    setNewImageUrl('');
    setScreen('FORM');
  };

  const handleSaveDish = async () => {
    const trimmedName = formName.trim();
    const numPrice = Number(formPrice);
    const numTime = Number(formPrepTime);

    if (!trimmedName) {
      Alert.alert('Validation', t.errNameEmpty);
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Validation', t.errPriceInvalid);
      return;
    }
    if (isNaN(numTime) || numTime <= 0) {
      Alert.alert('Validation', t.errTimeInvalid);
      return;
    }
    const catExists = categories.some(c => c.BIT240117_Id === formCategoryId);
    if (!catExists) {
      Alert.alert('Validation', t.errCategoryInvalid);
      return;
    }
    const isDuplicate = dishes.some(d =>
      d.BIT240117_DishCategoryId === formCategoryId &&
      d.BIT240117_Name.toLowerCase() === trimmedName.toLowerCase() &&
      (!editingDish || d.BIT240117_Id !== editingDish.BIT240117_Id)
    );
    if (isDuplicate) {
      Alert.alert('Validation', t.errDuplicateName);
      return;
    }

    let normalizedImages = [...formImages];
    if (normalizedImages.length > 0 && !normalizedImages.some(img => img.BIT240117_IsThumbnail)) {
      normalizedImages[0].BIT240117_IsThumbnail = true;
    }

    const dishRecord = {
      BIT240117_Id: editingDish ? editingDish.BIT240117_Id : `dish_${Date.now()}`,
      BIT240117_Name: trimmedName,
      BIT240117_Price: numPrice,
      BIT240117_PreparationTime: numTime,
      BIT240117_IsAvailable: formIsAvailable,
      BIT240117_Description: formDesc.trim(),
      BIT240117_DishCategoryId: formCategoryId,
      BIT240117_DishImage: normalizedImages,
      BIT240117_IsSynced: false
    };

    let updatedList;
    if (editingDish) {
      updatedList = dishes.map(d => d.BIT240117_Id === editingDish.BIT240117_Id ? dishRecord : d);
    } else {
      updatedList = [dishRecord, ...dishes];
    }

    await AsyncStorage.setItem(TABLE_DISH, JSON.stringify(updatedList));
    setDishes(updatedList);

    if (isConnected) {
      setTimeout(() => autoSyncOfflineData(), 300);
    }

    setSelectedDishId(dishRecord.BIT240117_Id);
    setScreen('LIST');
  };

  const handleDeleteDish = (dishId) => {
    Alert.alert(t.confirmDeleteTitle, t.confirmDeleteMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirm,
        style: 'destructive',
        onPress: async () => {
          const updated = dishes.filter(d => d.BIT240117_Id !== dishId);
          await AsyncStorage.setItem(TABLE_DISH, JSON.stringify(updated));
          setDishes(updated);
          setScreen('LIST');
        }
      }
    ]);
  };

  const handleDeleteCategory = async (catId) => {
    const inUse = dishes.some(d => d.BIT240117_DishCategoryId === catId);
    if (inUse) {
      Alert.alert('Constraint', t.errCategoryInUse);
      return;
    }
    const updatedCats = categories.filter(c => c.BIT240117_Id !== catId);
    await AsyncStorage.setItem(TABLE_CATEGORY, JSON.stringify(updatedCats));
    setCategories(updatedCats);
    Alert.alert('Info', t.catDeleted);
  };

  const addImageToDishDetail = async (dish, url) => {
    if (!url.trim()) return;
    const currentImages = dish.BIT240117_DishImage || [];
    const newImgObj = {
      BIT240117_ImageUrl: url.trim(),
      BIT240117_IsThumbnail: currentImages.length === 0
    };
    const updatedDish = {
      ...dish,
      BIT240117_DishImage: [...currentImages, newImgObj],
      BIT240117_IsSynced: false
    };
    const updatedList = dishes.map(d => d.BIT240117_Id === dish.BIT240117_Id ? updatedDish : d);
    await AsyncStorage.setItem(TABLE_DISH, JSON.stringify(updatedList));
    setDishes(updatedList);
    setNewImageUrl('');
  };

  const changeThumbnailInDetail = async (dish, indexToSet) => {
    const updatedImages = (dish.BIT240117_DishImage || []).map((img, idx) => ({
      ...img,
      BIT240117_IsThumbnail: idx === indexToSet
    }));
    const updatedDish = {
      ...dish,
      BIT240117_DishImage: updatedImages,
      BIT240117_IsSynced: false
    };
    const updatedList = dishes.map(d => d.BIT240117_Id === dish.BIT240117_Id ? updatedDish : d);
    await AsyncStorage.setItem(TABLE_DISH, JSON.stringify(updatedList));
    setDishes(updatedList);
  };

  const getFilteredAndSortedDishes = () => {
    const min = minPrice.trim() === '' ? 0 : Number(minPrice);
    const max = maxPrice.trim() === '' ? Infinity : Number(maxPrice);

    if (!isNaN(min) && !isNaN(max) && min > max) {
      return { error: t.errPriceRange, data: [] };
    }

    let result = dishes.filter(d => {
      const matchName = d.BIT240117_Name.toLowerCase().includes(searchText.trim().toLowerCase());
      const matchCat = filterCatId === 'ALL' || d.BIT240117_DishCategoryId === filterCatId;
      const matchAvail = !filterAvailableOnly || d.BIT240117_IsAvailable === true;
      const matchPrice = d.BIT240117_Price >= min && d.BIT240117_Price <= max;
      return matchName && matchCat && matchAvail && matchPrice;
    });

    if (sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.BIT240117_Price - b.BIT240117_Price);
    } else if (sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.BIT240117_Price - a.BIT240117_Price);
    } else if (sortBy === 'TIME_ASC') {
      result.sort((a, b) => a.BIT240117_PreparationTime - b.BIT240117_PreparationTime);
    }

    return { error: null, data: result };
  };

  const getThumbnail = (dish) => {
    const imgs = dish.BIT240117_DishImage || [];
    if (imgs.length === 0) return 'https://via.placeholder.com/150?text=No+Image';
    const thumb = imgs.find(i => i.BIT240117_IsThumbnail);
    return thumb ? thumb.BIT240117_ImageUrl : imgs[0].BIT240117_ImageUrl;
  };

  const getCategoryName = (catId) => {
    const found = categories.find(c => c.BIT240117_Id === catId);
    return found ? found.BIT240117_Name : 'Unknown';
  };

  const getPrepSpeedLabel = (minutes) => {
    return minutes <= 15 ? t.quickTag : t.regularTag;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>{t.appTitle}</Text>
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Text style={styles.langBtnText}>{lang === 'en' ? '🌐 EN ➔ VI' : '🌐 VI ➔ EN'}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.netBar, { backgroundColor: isConnected ? '#1b5e20' : '#b71c1c' }]}>
        <Text style={styles.netBarText}>
          {isConnected ? `🟢 ${t.networkOnline}` : `🔴 ${t.networkOffline}`}
        </Text>
      </View>
      {syncBanner !== '' && (
        <View style={styles.syncToast}>
          <Text style={styles.syncToastText}>🔄 {syncBanner}</Text>
        </View>
      )}
    </View>
  );

  if (screen === 'LIST') {
    const { error: priceRangeError, data: filteredDishes } = getFilteredAndSortedDishes();

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {renderHeader()}

        <View style={styles.filterBox}>
          <View style={styles.rowBetween}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder={t.searchPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={openAddForm}>
              <Text style={styles.primaryBtnText}>{t.addDishBtn}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryBtn, { marginLeft: 6 }]}
              onPress={() => setScreen('CATEGORIES')}
            >
              <Text style={styles.secondaryBtnText}>{t.manageCatBtn}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <TouchableOpacity
              style={[styles.chip, filterCatId === 'ALL' && styles.chipActive]}
              onPress={() => setFilterCatId('ALL')}
            >
              <Text style={filterCatId === 'ALL' ? styles.chipTextActive : styles.chipText}>{t.allCategories}</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.BIT240117_Id}
                style={[styles.chip, filterCatId === cat.BIT240117_Id && styles.chipActive]}
                onPress={() => setFilterCatId(cat.BIT240117_Id)}
              >
                <Text style={filterCatId === cat.BIT240117_Id ? styles.chipTextActive : styles.chipText}>
                  {cat.BIT240117_Name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rowBetween}>
            <TextInput
              style={[styles.inputSmall, { width: '28%' }]}
              placeholder={t.minPrice}
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <TextInput
              style={[styles.inputSmall, { width: '28%' }]}
              placeholder={t.maxPrice}
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
            <View style={styles.switchRow}>
              <Text style={{ fontSize: 12, marginRight: 4 }}>{t.availableOnly}</Text>
              <Switch value={filterAvailableOnly} onValueChange={setFilterAvailableOnly} />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
            <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginRight: 6, fontSize: 12 }}>{t.sortLabel}</Text>
            {[
              { key: 'NONE', label: t.sortNone },
              { key: 'PRICE_ASC', label: t.sortPriceAsc },
              { key: 'PRICE_DESC', label: t.sortPriceDesc },
              { key: 'TIME_ASC', label: t.sortTimeAsc },
            ].map(s => (
              <TouchableOpacity
                key={s.key}
                style={[styles.sortChip, sortBy === s.key && styles.sortChipActive]}
                onPress={() => setSortBy(s.key)}
              >
                <Text style={sortBy === s.key ? styles.chipTextActive : styles.chipText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {priceRangeError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{priceRangeError}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDishes}
            keyExtractor={item => item.BIT240117_Id}
            ListEmptyComponent={<Text style={styles.emptyText}>{t.emptyList}</Text>}
            renderItem={({ item }) => {
              const isQuick = item.BIT240117_PreparationTime <= 15;
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    setSelectedDishId(item.BIT240117_Id);
                    setScreen('DETAIL');
                  }}
                >
                  <Image source={{ uri: getThumbnail(item) }} style={styles.cardImg} />
                  <View style={styles.cardBody}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.cardTitle}>{item.BIT240117_Name}</Text>
                      <Text style={styles.syncDot}>{item.BIT240117_IsSynced ? '☁️✓' : '💾Offline'}</Text>
                    </View>
                    <Text style={styles.cardCat}>{getCategoryName(item.BIT240117_DishCategoryId)}</Text>
                    <Text style={styles.cardPrice}>{item.BIT240117_Price.toLocaleString()} VNĐ</Text>
                    <View style={styles.badgeRow}>
                      <View style={[styles.badge, { backgroundColor: isQuick ? '#e3f2fd' : '#fff3e0' }]}>
                        <Text style={{ color: isQuick ? '#0d47a1' : '#e65100', fontSize: 11, fontWeight: 'bold' }}>
                          ⏱ {item.BIT240117_PreparationTime}m • {getPrepSpeedLabel(item.BIT240117_PreparationTime)}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: item.BIT240117_IsAvailable ? '#e8f5e9' : '#ffebee' }]}>
                        <Text style={{ color: item.BIT240117_IsAvailable ? '#2e7d32' : '#c62828', fontSize: 11 }}>
                          {item.BIT240117_IsAvailable ? t.statusAvailable : t.statusUnavailable}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    );
  }

  if (screen === 'DETAIL') {
    const dish = dishes.find(d => d.BIT240117_Id === selectedDishId);
    if (!dish) {
      return (
        <SafeAreaView style={styles.container}>
          {renderHeader()}
          <Text style={styles.emptyText}>{t.errNotFound}</Text>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setScreen('LIST')}>
            <Text style={styles.secondaryBtnText}>{t.backBtn}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    const images = dish.BIT240117_DishImage || [];

    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ScrollView contentContainerStyle={{ padding: 14 }}>
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setScreen('LIST')}>
              <Text style={styles.secondaryBtnText}>{t.backBtn}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.primaryBtn, { marginRight: 8 }]} onPress={() => openEditForm(dish)}>
                <Text style={styles.primaryBtnText}>{t.editBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dangerBtn} onPress={() => handleDeleteDish(dish.BIT240117_Id)}>
                <Text style={styles.primaryBtnText}>{t.deleteBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Image source={{ uri: getThumbnail(dish) }} style={styles.detailMainImg} />

          <Text style={styles.detailTitle}>{dish.BIT240117_Name}</Text>
          <Text style={styles.detailPrice}>{dish.BIT240117_Price.toLocaleString()} VNĐ</Text>
          <Text style={styles.detailMeta}>
            📂 {getCategoryName(dish.BIT240117_DishCategoryId)}  |  ⏱ {dish.BIT240117_PreparationTime} mins ({getPrepSpeedLabel(dish.BIT240117_PreparationTime)})
          </Text>
          <Text style={styles.detailMeta}>
            🏷 {dish.BIT240117_IsAvailable ? t.statusAvailable : t.statusUnavailable}
          </Text>
          <Text style={styles.detailDesc}>{dish.BIT240117_Description}</Text>

          <Text style={styles.sectionHeader}>{t.imagesSection}</Text>
          <View style={styles.rowBetween}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder={t.imageUrlPlaceholder}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => addImageToDishDetail(dish, newImageUrl)}>
              <Text style={styles.primaryBtnText}>{t.addImageBtn}</Text>
            </TouchableOpacity>
          </View>

          {images.length === 0 ? (
            <Text style={styles.emptyText}>{t.noImages}</Text>
          ) : (
            <ScrollView horizontal style={{ marginTop: 12 }}>
              {images.map((img, idx) => (
                <View key={idx} style={styles.galleryCard}>
                  <Image source={{ uri: img.BIT240117_ImageUrl }} style={styles.galleryImg} />
                  <TouchableOpacity
                    style={[styles.thumbBtn, img.BIT240117_IsThumbnail && styles.thumbBtnActive]}
                    onPress={() => changeThumbnailInDetail(dish, idx)}
                  >
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
                      {img.BIT240117_IsThumbnail ? t.thumbnailActive : t.setThumbnailBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'FORM') {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ScrollView contentContainerStyle={{ padding: 14 }}>
          <TouchableOpacity style={[styles.secondaryBtn, { alignSelf: 'flex-start', marginBottom: 12 }]} onPress={() => setScreen('LIST')}>
            <Text style={styles.secondaryBtnText}>{t.backBtn}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>{t.dishName}</Text>
          <TextInput style={styles.input} value={formName} onChangeText={setFormName} />

          <Text style={styles.label}>{t.price}</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={formPrice} onChangeText={setFormPrice} />

          <Text style={styles.label}>{t.prepTime}</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={formPrepTime} onChangeText={setFormPrepTime} />

          <Text style={styles.label}>{t.category}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.BIT240117_Id}
                style={[styles.chip, formCategoryId === cat.BIT240117_Id && styles.chipActive]}
                onPress={() => setFormCategoryId(cat.BIT240117_Id)}
              >
                <Text style={formCategoryId === cat.BIT240117_Id ? styles.chipTextActive : styles.chipText}>
                  {cat.BIT240117_Name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.rowBetween, { marginVertical: 10 }]}>
            <Text style={styles.label}>{t.isAvailable}</Text>
            <Switch value={formIsAvailable} onValueChange={setFormIsAvailable} />
          </View>

          <Text style={styles.label}>{t.description}</Text>
          <TextInput
            style={[styles.input, { height: 70 }]}
            multiline
            value={formDesc}
            onChangeText={setFormDesc}
          />

          <Text style={styles.label}>{t.imagesSection}</Text>
          <View style={styles.rowBetween}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder={t.imageUrlPlaceholder}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
            />
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => {
                if (!newImageUrl.trim()) return;
                setFormImages([
                  ...formImages,
                  { BIT240117_ImageUrl: newImageUrl.trim(), BIT240117_IsThumbnail: formImages.length === 0 }
                ]);
                setNewImageUrl('');
              }}
            >
              <Text style={styles.secondaryBtnText}>{t.addImageBtn}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={{ marginVertical: 10 }}>
            {formImages.map((img, i) => (
              <View key={i} style={styles.galleryCard}>
                <Image source={{ uri: img.BIT240117_ImageUrl }} style={styles.galleryImg} />
                <TouchableOpacity
                  style={[styles.thumbBtn, img.BIT240117_IsThumbnail && styles.thumbBtnActive]}
                  onPress={() => {
                    setFormImages(formImages.map((item, idx) => ({
                      ...item,
                      BIT240117_IsThumbnail: idx === i
                    })));
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 11 }}>
                    {img.BIT240117_IsThumbnail ? t.thumbnailActive : t.setThumbnailBtn}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16, paddingVertical: 12 }]} onPress={handleSaveDish}>
            <Text style={[styles.primaryBtnText, { textAlign: 'center', fontSize: 16 }]}>{t.saveBtn}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'CATEGORIES') {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={{ padding: 14 }}>
          <TouchableOpacity style={[styles.secondaryBtn, { alignSelf: 'flex-start', marginBottom: 12 }]} onPress={() => setScreen('LIST')}>
            <Text style={styles.secondaryBtnText}>{t.backBtn}</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <View key={cat.BIT240117_Id} style={[styles.card, { padding: 12, justifyContent: 'space-between', alignItems: 'center' }]}>
              <View>
                <Text style={styles.cardTitle}>{cat.BIT240117_Name}</Text>
                <Text style={styles.cardCat}>{cat.BIT240117_Description}</Text>
              </View>
              <TouchableOpacity style={styles.dangerBtn} onPress={() => handleDeleteCategory(cat.BIT240117_Id)}>
                <Text style={styles.primaryBtnText}>{t.deleteBtn}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  headerContainer: { backgroundColor: '#1e272e' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  langBtn: { backgroundColor: '#485460', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  langBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  netBar: { paddingVertical: 4, alignItems: 'center' },
  netBarText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  syncToast: { backgroundColor: '#0fb9b1', padding: 6, alignItems: 'center' },
  syncToastText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  filterBox: { backgroundColor: '#fff', padding: 10, elevation: 2, marginBottom: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#fff', fontSize: 13 },
  inputSmall: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: '#fff', fontSize: 12 },
  primaryBtn: { backgroundColor: '#0984e3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  secondaryBtn: { backgroundColor: '#dfe6e9', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6 },
  secondaryBtnText: { color: '#2d3436', fontWeight: 'bold', fontSize: 13 },
  dangerBtn: { backgroundColor: '#d63031', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  chipScroll: { marginVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#dfe6e9', marginRight: 6, marginBottom: 4 },
  chipActive: { backgroundColor: '#0984e3' },
  chipText: { color: '#2d3436', fontSize: 12 },
  chipTextActive: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  sortChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#b2bec3', marginRight: 6 },
  sortChipActive: { backgroundColor: '#2d3436', borderColor: '#2d3436' },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 8, overflow: 'hidden', elevation: 1 },
  cardImg: { width: 95, height: 95 },
  cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#2d3436' },
  cardCat: { fontSize: 12, color: '#636e72' },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: '#d63031' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  syncDot: { fontSize: 11, color: '#636e72' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#636e72', fontSize: 14 },
  errorBox: { backgroundColor: '#ffebee', padding: 12, margin: 10, borderRadius: 6 },
  errorText: { color: '#c62828', fontWeight: 'bold', textAlign: 'center' },
  detailMainImg: { width: '100%', height: 220, borderRadius: 8, marginTop: 12 },
  detailTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 12, color: '#2d3436' },
  detailPrice: { fontSize: 18, fontWeight: 'bold', color: '#d63031', marginVertical: 4 },
  detailMeta: { fontSize: 13, color: '#636e72', marginTop: 4 },
  detailDesc: { fontSize: 14, color: '#2d3436', marginTop: 10, lineHeight: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  galleryCard: { marginRight: 12, alignItems: 'center', backgroundColor: '#fff', padding: 6, borderRadius: 8 },
  galleryImg: { width: 120, height: 90, borderRadius: 6 },
  thumbBtn: { marginTop: 6, backgroundColor: '#636e72', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  thumbBtnActive: { backgroundColor: '#e1b12c' },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 4, fontSize: 13, color: '#2d3436' }
});
