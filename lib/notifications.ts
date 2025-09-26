import Notification, { NotificationType } from "@/models/notification.model";
import User from "@/models/user.model";

export class NotificationService {
  static async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata: Record<string, unknown>;
  }) {
    return Notification.create(data);
  }

  /**
   * Get user notification preferences
   */
  private static async getUserPreferences(userId: string) {
    try {
      const user = await User.findById(userId).select("preferences");
      if (!user || !user.preferences) {
        // Return default preferences if user not found or no preferences set
        return {
          lowStockNotifications: true,
          newOrderNotification: true,
          outOfStockNotification: true,
        };
      }
      return user.preferences;
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      // Return default preferences on error
      return {
        lowStockNotifications: true,
        newOrderNotification: true,
        outOfStockNotification: true,
      };
    }
  }

  /**
   * Create low stock notification if user has enabled this preference
   */
  static async lowStock(
    userId: string,
    productName: string,
    currentStock: number
  ) {
    const preferences = await this.getUserPreferences(userId);

    // Only create notification if user has enabled low stock notifications
    if (!preferences.lowStockNotifications) {
      console.log(
        `Low stock notification skipped for user ${userId} - preference disabled`
      );
      return null;
    }

    return this.create({
      userId,
      type: "low_stock",
      title: "Low Stock Alert: ",
      message: `${productName} is running low on stock. Only ${currentStock} are left`,
      metadata: { currentStock, productName },
    });
  }

  /**
   * Create new order notification if user has enabled this preference
   */
  static async newOrder(userId: string, customerName: string, amount: number) {
    const preferences = await this.getUserPreferences(userId);

    // Only create notification if user has enabled new order notifications
    if (!preferences.newOrderNotification) {
      console.log(
        `New order notification skipped for user ${userId} - preference disabled`
      );
      return null;
    }

    return this.create({
      userId,
      type: "new_order",
      title: "New Order",
      message: `Order from ${customerName} for $${amount}`,
      metadata: { customerName, amount },
    });
  }

  /**
   * Create out of stock notification if user has enabled this preference
   */
  static async outOfStock(userId: string, productName: string) {
    const preferences = await this.getUserPreferences(userId);

    // Only create notification if user has enabled out of stock notifications
    if (!preferences.outOfStockNotification) {
      console.log(
        `Out of stock notification skipped for user ${userId} - preference disabled`
      );
      return null;
    }

    return this.create({
      userId,
      type: "out_of_stock",
      title: "Product Out of Stock: ",
      message: `${productName} is out of stock`,
      metadata: { productName },
    });
  }
}
