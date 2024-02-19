class CreatePositionRecord < ActiveRecord::Migration[7.1]
  def change
    create_table :position_records do |t|
      t.integer :player_id
      t.string :position
      t.integer :started_at
      t.integer :finished_at
      t.timestamps
    end
  end
end
