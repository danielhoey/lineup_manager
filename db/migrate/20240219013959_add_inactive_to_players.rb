class AddInactiveToPlayers < ActiveRecord::Migration[7.1]
  def change
    add_column :players, :inactive, :boolean, default: false
  end
end
