"use client";

import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderList from "@/components/orders/OrderList";
import { IUser } from "@/types/implements";
import { showError, showSuccess } from "@/libs/toast";
import { getMyInfo, updateMe } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UserAccountPage() {
  const [selected, setSelected] = useState<"profile" | "orders" | null>(
    "profile"
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayName, setDisplayName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState({
    prefecture: "",
    city: "",
    town: "",
  });
  const [addressDetail, setAddressDetail] = useState("");
  const [contact, setContact] = useState("");

  const handleZipcodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setZipcode(value);

    if (value.length === 7) {
      try {
        const res = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${value}`
        );
        const data = await res.json();

        if (data.results) {
          const result = data.results[0];
          setAddress({
            prefecture: result.address1,
            city: result.address2,
            town: result.address3,
          });
        } else {
          showError("Không tìm thấy địa chỉ cho mã bưu điện này.");
        }
      } catch {
        showError("Lỗi kết nối đến ZipCloud API.");
      }
    } else {
      setAddress({
        prefecture: "",
        city: "",
        town: "",
      });
    }
  };

  const featchUser = async () => {
    try {
      const response = await getMyInfo();
      if (response.data) {
        setDisplayName(response.data?.displayName);
        setAddressDetail(response.data.addressDetail);
        setZipcode(response.data.zipcode);
        setContact(response.data.contact);
        try {
          const res = await fetch(
            `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${response.data.zipcode}`
          );
          const data = await res.json();

          if (data.results) {
            const result = data.results[0];
            setAddress({
              prefecture: result.address1,
              city: result.address2,
              town: result.address3,
            });
          } else {
            showError("Không tìm thấy địa chỉ cho mã bưu điện này.");
          }
        } catch {
          showError("Lỗi kết nối đến ZipCloud API.");
        }
      }
    } catch (error) {
      showError("Lỗi khi lấy thông tin user");
    }
  };
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "profile" || tab === "orders") {
      setSelected(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    featchUser();
  }, []);

  const handleTabChange = (tab: "profile" | "orders") => {
    const url = new URL(window.location.href);
    if (selected === tab) {
      url.searchParams.delete("tab");
      setSelected(null); // toggle off
    } else {
      url.searchParams.set("tab", tab);
      setSelected(tab);
    }
    router.push(url.toString());
  };

  const handleClickButtonSaveUser = async () => {
    const user = {
      displayName,
      zipcode,
      addressDetail,
      contact: "", // Thay đổi giá trị này nếu bạn có trường liên hệ (contact) từ dữ liệu người dùng
    };

    try {
      const response = await updateMe(user);
      if (response.data) showSuccess("Cập nhật thông tin thành công.!");
    } catch (error) {
      showError("Lỗi khi cập nhật thông tin");
    }
  };

  return (
    <div className="w-full md:px-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6">
        {/* Sidebar – chỉ hiện trên desktop */}
        <aside className="hidden md:block w-64 shrink-0 border-r pr-4">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleTabChange("profile")}
              className={`text-left px-4 py-2 rounded-md ${
                selected === "profile"
                  ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              Thông tin tài khoản
            </button>
            <button
              onClick={() => handleTabChange("orders")}
              className={`text-left px-4 py-2 rounded-md ${
                selected === "orders"
                  ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              Đơn hàng đã đặt
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Desktop – theo tab */}
          <div className="hidden md:block">
            {selected === "profile" && (
              <section>
                <div className=" space-y-4">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-md" htmlFor="zipcode">
                        Tên hiển thị:
                      </Label>
                    </div>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName ?? ""}
                      maxLength={7}
                      placeholder="Nhập tên của bạn"
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-md" htmlFor="zipcode">
                        Mã bưu điện:
                      </Label>
                      <p className="font-light italic text-sm">
                        (Nhập đầy đủ mã bưu điện để hiện địa chỉ (7 số))
                      </p>
                    </div>
                    <Input
                      id="zipcode"
                      type="text"
                      value={zipcode ?? ""}
                      onChange={handleZipcodeChange}
                      maxLength={7}
                      placeholder="Ví dụ: 1000001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="pref">
                      Tỉnh/TP
                    </Label>

                    <p className="font-light italic text-sm">
                      ("沖縄", "北海道", "長崎", "大分" cộng phí ship 400¥)
                    </p>
                    <Input
                      id="pref"
                      value={address.prefecture}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="city">
                      Quận/Huyện
                    </Label>
                    <Input
                      id="city"
                      value={address.city}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="town">
                      Phường/Xã
                    </Label>
                    <Input
                      id="town"
                      value={address.town}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="detail">
                      Địa chỉ cụ thể
                    </Label>
                    <Input
                      id="detail"
                      value={addressDetail ?? ""}
                      placeholder="Ví dụ: 1-2-3 サンプルビル 301号室"
                      onChange={(e) => setAddressDetail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="detail">
                      Liên hệ
                    </Label>
                    <Input
                      id="contact"
                      value={contact ?? ""}
                      placeholder="https://www.facebook.com/tiemveclimpingrose"
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <Button
                    className="float-right"
                    onClick={handleClickButtonSaveUser}
                  >
                    Lưu
                  </Button>
                </div>
              </section>
            )}
            {selected === "orders" && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Đơn hàng đã đặt</h2>
                <OrderList />
              </section>
            )}
          </div>

          {/* Mobile – collapsible */}
          <div className="md:hidden space-y-4">
            <Collapsible open={selected === "profile"} className="w-full">
              <CollapsibleTrigger
                className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md font-medium"
                onClick={() => handleTabChange("profile")}
              >
                <span>Thông tin tài khoản</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 px-4">
                <div className=" space-y-4">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-md" htmlFor="zipcode">
                        Tên hiển thị:
                      </Label>
                    </div>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName ?? ""}
                      maxLength={7}
                      placeholder="Nhập tên của bạn"
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-md" htmlFor="zipcode">
                        Mã bưu điện:
                      </Label>
                      <p className="font-light italic text-sm">
                        (Nhập đầy đủ mã bưu điện để hiện địa chỉ (7 số))
                      </p>
                    </div>
                    <Input
                      id="zipcode"
                      type="text"
                      value={zipcode ?? ""}
                      onChange={handleZipcodeChange}
                      maxLength={7}
                      placeholder="Ví dụ: 1000001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="pref">
                      Tỉnh/TP
                    </Label>

                    <p className="font-light italic text-sm">
                      ("沖縄", "北海道", "長崎", "大分" cộng phí ship 400¥)
                    </p>
                    <Input
                      id="pref"
                      value={address.prefecture}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="city">
                      Quận/Huyện
                    </Label>
                    <Input
                      id="city"
                      value={address.city}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="town">
                      Phường/Xã
                    </Label>
                    <Input
                      id="town"
                      value={address.town}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="detail">
                      Địa chỉ cụ thể
                    </Label>
                    <Input
                      id="detail"
                      value={addressDetail ?? ""}
                      placeholder="Ví dụ: 1-2-3 サンプルビル 301号室"
                      onChange={(e) => setAddressDetail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-md" htmlFor="detail">
                      Liên hệ
                    </Label>
                    <Input
                      id="contact"
                      value={contact ?? ""}
                      placeholder="https://www.facebook.com/tiemveclimpingrose"
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <Button
                    className="float-right"
                    onClick={handleClickButtonSaveUser}
                  >
                    Lưu
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={selected === "orders"} className="w-full">
              <CollapsibleTrigger
                className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md font-medium"
                onClick={() => handleTabChange("orders")}
              >
                <span>Đơn hàng đã đặt</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <OrderList />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </main>
      </div>
    </div>
  );
}
