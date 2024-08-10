export default function Policy() {
  return (
    <div className="flex items-center justify-center py-5 mx-5 mt-12">
      <div className="">
        <div className="text-4xl md:text-5xl opacity-95">Shipping policy</div>
        <div className="text-base font-medium md:text-lg">
          <div className="mt-4 lg:mt-6">
            Goods ordered via this site can be shipped via air or sea.
          </div>
          <div className="mt-4 lg:mt-6 font-bold">Air Shipping</div>
          <div>Minimum Kilogram (kg): 1kg</div>
          <div>
            Duration: Normal goods-within 10 days, Hong Kong goods-25 days
          </div>
          <div className="mt-4 lg:mt-6 font-bold">Sea Shipping</div>
          <div>Minimum Cubic metre (cbm): 0.05cbm</div>
          <div>Duration 70 days</div>
          <div className="mt-4 lg:mt-6">
            Kindly choose shipping mode accurately
          </div>
        </div>
      </div>
    </div>
  );
}
