class CreateMatches < ActiveRecord::Migration[7.1]
  def change
    create_table :matches do |t|
      t.integer :round
      t.string :opponent
      t.text :lineup
      t.boolean :completed
      t.timestamps
    end
  end
end
