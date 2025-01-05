import ShopForm from '@features/shop/components/shop-form.component';
import { useAddShop } from '@features/shop/hooks/use-add-shop.hook';
import { ShopFormType } from '@features/shop/interface/shop-form.interface';
import { useGlobalLoading } from '@shared/context/global-loading.context';
import { useEffect } from 'react';

const AddShopPage = () => {
	const { mutate, isPending, isError } = useAddShop();
	const { showLoading, hideLoading } = useGlobalLoading();
	const handleSave = (shop: ShopFormType) => {
		mutate(shop);
	};
	useEffect(() => {
		if (isPending) {
			showLoading();
		} else {
			hideLoading();
		}
	}, [isPending]);
	return <ShopForm formTitle="Add new shop" onSubmit={handleSave} />;
};

export default AddShopPage;
