import Notification, { NotificationType } from "@/models/notification.model";

export class NotificationService {
  static async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata: Record<string, any>;
  }) {
    return Notification.create(data);
  }

  static async lowStock(
    userId: string,
    productName: string,
    currentStock: number
  ) {
    return this.create({
      userId,
      type: "low_stock",
      title: "Low Stock Alert: ",
      message: `${productName} is running low on stock. Only ${currentStock} are left`,
      metadata: { currentStock },
    });
  }

  static async newOrder(userId: string, customerName: string, amount: number) {
    return this.create({
      userId,
      type: "new_order",
      title: "New Order",
      message: `Order from ${customerName} for $${amount}`,
      metadata: { customerName, amount },
    });
  }

  static async outOfStock(userId: string, productName: string) {
    return this.create({
      userId,
      type: "out_of_stock",
      title: "Product Out of Stock: ",
      message: `${productName} is out of stock`,
      metadata: { productName },
    });
  }
}
