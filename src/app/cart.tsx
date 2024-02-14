import { Alert, Linking, ScrollView, Text, View } from "react-native";

import { ProductCartProps, useCartStore } from "@/stores/cartStore";

import Header from "@/components/Header";
import Product from "@/components/Product";
import formatCurrency from "@/utils/functions/formatCurrency";
import Input from "@/components/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "@/components/Button";
import { Feather } from "@expo/vector-icons";
import LinkButton from "@/components/LinkButton";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5535999592980"

export default function Cart() {
  const cartStore = useCartStore()
  const navigation = useNavigation()

  const [address, setAddress] = useState("")

  const total = formatCurrency(cartStore.products.reduce((total, product) =>
    total + product.price * product.quantity, 0))

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remove", `Do you wish to remove ${product.title} from the cart?`, [
      { text: "Cancel" },
      {
        text: "Remove",
        onPress: () => cartStore.remove(product.id),
      }
    ])
  }

  function handleOrder() {
    if(address.trim().length === 0) { 
      return Alert.alert("Order", "Enter the delivery data.")
    }

    const products = cartStore.products.map(product => `\n ${product.quantity} ${product.title}`)
      .join("")

    const message = `NEW ORDER\n Delivery to: ${address}${products}\nTotal: ${total}`
    
    Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=&${message}`)

    cartStore.clear()
    navigation.goBack()
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Your cart" />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
          {cartStore.products.length > 0 ? (
            <View>
              {cartStore.products.map(product => (
                <Product
                  key={product.id}
                  data={product}
                  onPress={() => handleProductRemove(product)}
                />
              ))}
            </View>
          ) : (
            <Text className="font-body text-slate-400 text-center my-8">Your cart is empty.</Text>
          )}

          <View className="flex-row gap-2 items-center mt-5 mb-4">
            <Text className="text-white text-xl font-subtitle">Total:</Text>
            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>

          <Input
            placeholder="Enter the delivery address with street, nighborhood, ZIP code, number and complement."
            onChangeText={setAddress}
            blurOnSubmit={true}
            onSubmitEditing={handleOrder}
            returnKeyLabel="next"
          />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Send order</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Return to menu" href="/" />
      </View>
    </View>
  )
}